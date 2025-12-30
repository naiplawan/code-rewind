import type {
	UserStats,
	PlatformStats,
	LanguageStat,
	RepoStat,
	ContributionDay,
	ProductivityPattern,
	DeveloperPersonality
} from '$lib/types';

export function combineStats(
	githubStats: PlatformStats | null,
	gitlabStats: PlatformStats | null,
	githubCalendar: ContributionDay[],
	gitlabCalendar: ContributionDay[]
): UserStats {
	// Combine contribution calendars
	const calendarMap = new Map<string, number>();

	for (const day of [...githubCalendar, ...gitlabCalendar]) {
		calendarMap.set(day.date, (calendarMap.get(day.date) || 0) + day.count);
	}

	const contributionCalendar: ContributionDay[] = Array.from(calendarMap.entries())
		.map(([date, count]) => ({ date, count }))
		.sort((a, b) => a.date.localeCompare(b.date));

	// Calculate totals
	const totalCommits = (githubStats?.commits || 0) + (gitlabStats?.commits || 0);
	const totalPRs = (githubStats?.prs || 0) + (gitlabStats?.prs || 0);
	const totalIssues = (githubStats?.issues || 0) + (gitlabStats?.issues || 0);
	const totalReviews = (githubStats?.reviews || 0) + (gitlabStats?.reviews || 0);

	// Combine and sort languages
	const topLanguages = combineLanguages(
		githubStats?.languages || [],
		gitlabStats?.languages || []
	);

	// Combine and sort repos
	const topRepos = combineRepos(githubStats?.topRepos || [], gitlabStats?.topRepos || []);

	// Calculate streaks
	const { longestStreak, longestStreakStart, longestStreakEnd, currentStreak } =
		calculateStreaks(contributionCalendar);

	// Calculate productivity patterns
	const productivityPatterns = calculateProductivityPatterns(contributionCalendar);
	const { mostProductiveDay, mostProductiveHour } =
		getMostProductiveTimes(productivityPatterns);

	// Determine personality
	const personality = determinePersonality({
		totalCommits,
		totalPRs,
		totalReviews,
		topLanguages,
		mostProductiveHour,
		longestStreak
	});

	return {
		totalCommits,
		totalPRs,
		totalIssues,
		totalReviews,
		linesAdded: 0, // Would need additional API calls
		linesDeleted: 0,
		topLanguages,
		topRepos,
		contributionCalendar,
		productivityPatterns,
		longestStreak,
		longestStreakStart,
		longestStreakEnd,
		currentStreak,
		mostProductiveDay,
		mostProductiveHour,
		personality,
		githubStats,
		gitlabStats
	};
}

function combineLanguages(github: LanguageStat[], gitlab: LanguageStat[]): LanguageStat[] {
	const langMap = new Map<string, { percentage: number; color: string }>();

	// Weight by total from each platform
	const githubTotal = github.reduce((sum, l) => sum + l.percentage, 0);
	const gitlabTotal = gitlab.reduce((sum, l) => sum + l.percentage, 0);
	const total = githubTotal + gitlabTotal;

	if (total === 0) return [];

	for (const lang of github) {
		const weighted = (lang.percentage / 100) * (githubTotal / total) * 100;
		langMap.set(lang.name, { percentage: weighted, color: lang.color });
	}

	for (const lang of gitlab) {
		const weighted = (lang.percentage / 100) * (gitlabTotal / total) * 100;
		const existing = langMap.get(lang.name);
		if (existing) {
			langMap.set(lang.name, {
				percentage: existing.percentage + weighted,
				color: existing.color
			});
		} else {
			langMap.set(lang.name, { percentage: weighted, color: lang.color });
		}
	}

	return Array.from(langMap.entries())
		.map(([name, { percentage, color }]) => ({
			name,
			percentage: Math.round(percentage * 10) / 10,
			color
		}))
		.sort((a, b) => b.percentage - a.percentage)
		.slice(0, 5);
}

function combineRepos(github: RepoStat[], gitlab: RepoStat[]): RepoStat[] {
	return [...github, ...gitlab].sort((a, b) => b.commits - a.commits).slice(0, 5);
}

function calculateStreaks(calendar: ContributionDay[]): {
	longestStreak: number;
	longestStreakStart: string;
	longestStreakEnd: string;
	currentStreak: number;
} {
	if (calendar.length === 0) {
		return {
			longestStreak: 0,
			longestStreakStart: '',
			longestStreakEnd: '',
			currentStreak: 0
		};
	}

	// Sort by date
	const sorted = [...calendar].sort((a, b) => a.date.localeCompare(b.date));

	let longestStreak = 0;
	let longestStreakStart = '';
	let longestStreakEnd = '';
	let currentStreak = 0;
	let currentStreakStart = '';

	let prevDate: Date | null = null;

	for (const day of sorted) {
		if (day.count === 0) {
			// Reset current streak
			if (currentStreak > longestStreak) {
				longestStreak = currentStreak;
				longestStreakStart = currentStreakStart;
				longestStreakEnd = prevDate ? formatDate(prevDate) : '';
			}
			currentStreak = 0;
			currentStreakStart = '';
			prevDate = null;
			continue;
		}

		const currentDate = new Date(day.date);

		if (prevDate === null) {
			// Start new streak
			currentStreak = 1;
			currentStreakStart = day.date;
		} else {
			// Check if consecutive day
			const diffDays = Math.round(
				(currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
			);

			if (diffDays === 1) {
				currentStreak++;
			} else {
				// Streak broken
				if (currentStreak > longestStreak) {
					longestStreak = currentStreak;
					longestStreakStart = currentStreakStart;
					longestStreakEnd = formatDate(prevDate);
				}
				currentStreak = 1;
				currentStreakStart = day.date;
			}
		}

		prevDate = currentDate;
	}

	// Check final streak
	if (currentStreak > longestStreak) {
		longestStreak = currentStreak;
		longestStreakStart = currentStreakStart;
		longestStreakEnd = prevDate ? formatDate(prevDate) : '';
	}

	// Calculate current streak (from today backwards)
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	let activeStreak = 0;
	const calendarMap = new Map(calendar.map((d) => [d.date, d.count]));

	for (let i = 0; i < 365; i++) {
		const checkDate = new Date(today);
		checkDate.setDate(checkDate.getDate() - i);
		const dateStr = formatDate(checkDate);
		const count = calendarMap.get(dateStr) || 0;

		if (count > 0) {
			activeStreak++;
		} else if (i > 0) {
			// Allow today to be missing
			break;
		}
	}

	return {
		longestStreak,
		longestStreakStart,
		longestStreakEnd,
		currentStreak: activeStreak
	};
}

function formatDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

function calculateProductivityPatterns(calendar: ContributionDay[]): ProductivityPattern[] {
	// Since we only have date-level data, we'll approximate hour patterns
	// In a real app, you'd need commit timestamps

	const dayPatterns: Record<number, number> = {};

	for (const day of calendar) {
		if (day.count === 0) continue;
		const date = new Date(day.date);
		const dayOfWeek = date.getDay();
		dayPatterns[dayOfWeek] = (dayPatterns[dayOfWeek] || 0) + day.count;
	}

	// Create patterns for visualization
	const patterns: ProductivityPattern[] = [];
	for (let day = 0; day < 7; day++) {
		// Distribute commits across typical working hours (9-21)
		const dayTotal = dayPatterns[day] || 0;
		for (let hour = 9; hour <= 21; hour++) {
			// Simulate hour distribution with peaks at 10-11 and 14-16
			let weight = 1;
			if (hour >= 10 && hour <= 11) weight = 1.5;
			if (hour >= 14 && hour <= 16) weight = 1.3;
			if (hour >= 19) weight = 0.8;

			patterns.push({
				dayOfWeek: day,
				hour,
				count: Math.round((dayTotal / 13) * weight)
			});
		}
	}

	return patterns;
}

function getMostProductiveTimes(patterns: ProductivityPattern[]): {
	mostProductiveDay: string;
	mostProductiveHour: number;
} {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Find most productive day
	const dayTotals: Record<number, number> = {};
	const hourTotals: Record<number, number> = {};

	for (const p of patterns) {
		dayTotals[p.dayOfWeek] = (dayTotals[p.dayOfWeek] || 0) + p.count;
		hourTotals[p.hour] = (hourTotals[p.hour] || 0) + p.count;
	}

	let maxDay = 0;
	let maxDayCount = 0;
	for (const [day, count] of Object.entries(dayTotals)) {
		if (count > maxDayCount) {
			maxDayCount = count;
			maxDay = parseInt(day);
		}
	}

	let maxHour = 10;
	let maxHourCount = 0;
	for (const [hour, count] of Object.entries(hourTotals)) {
		if (count > maxHourCount) {
			maxHourCount = count;
			maxHour = parseInt(hour);
		}
	}

	return {
		mostProductiveDay: dayNames[maxDay],
		mostProductiveHour: maxHour
	};
}

interface PersonalityInput {
	totalCommits: number;
	totalPRs: number;
	totalReviews: number;
	topLanguages: LanguageStat[];
	mostProductiveHour: number;
	longestStreak: number;
}

function determinePersonality(input: PersonalityInput): DeveloperPersonality {
	const personalities: DeveloperPersonality[] = [
		{
			type: 'night-owl',
			title: 'The Night Owl',
			description: 'You do your best work when the world sleeps. Late nights and coffee fuel your code.',
			icon: '🦉'
		},
		{
			type: 'early-bird',
			title: 'The Early Bird',
			description: 'You catch the worm! Morning commits set the tone for productive days.',
			icon: '🐦'
		},
		{
			type: 'polyglot',
			title: 'The Polyglot',
			description: 'Languages are just tools to you. You speak fluently in multiple syntaxes.',
			icon: '🌍'
		},
		{
			type: 'specialist',
			title: 'The Specialist',
			description: 'You know your stack inside out. Depth over breadth is your philosophy.',
			icon: '🎯'
		},
		{
			type: 'team-player',
			title: 'The Team Player',
			description: 'Reviews, PRs, collaboration - you make your team better every day.',
			icon: '🤝'
		},
		{
			type: 'marathon-runner',
			title: 'The Marathon Runner',
			description: 'Your consistency is legendary. Day after day, you show up and ship.',
			icon: '🏃'
		},
		{
			type: 'sprinter',
			title: 'The Sprinter',
			description: 'When you code, you CODE. Intense bursts of productivity define your style.',
			icon: '⚡'
		},
		{
			type: 'architect',
			title: 'The Architect',
			description: 'You think big picture. Your commits shape the foundation of projects.',
			icon: '🏗️'
		}
	];

	// Determine based on patterns
	let type = 'marathon-runner';

	// Night owl vs early bird
	if (input.mostProductiveHour >= 20 || input.mostProductiveHour <= 6) {
		type = 'night-owl';
	} else if (input.mostProductiveHour >= 5 && input.mostProductiveHour <= 9) {
		type = 'early-bird';
	}

	// Polyglot vs specialist
	if (input.topLanguages.length >= 4 && input.topLanguages[0]?.percentage < 50) {
		type = 'polyglot';
	} else if (input.topLanguages.length > 0 && input.topLanguages[0]?.percentage > 70) {
		type = 'specialist';
	}

	// Team player
	if (input.totalReviews > input.totalCommits * 0.3 || input.totalPRs > input.totalCommits * 0.2) {
		type = 'team-player';
	}

	// Marathon runner
	if (input.longestStreak > 30) {
		type = 'marathon-runner';
	}

	// High volume = sprinter
	if (input.totalCommits > 1000 && input.longestStreak < 14) {
		type = 'sprinter';
	}

	// Architect (high commits, good streak, moderate PRs)
	if (input.totalCommits > 500 && input.longestStreak > 20 && input.totalPRs > 50) {
		type = 'architect';
	}

	return personalities.find((p) => p.type === type) || personalities[0];
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
}

export function formatHour(hour: number): string {
	if (hour === 0) return '12 AM';
	if (hour === 12) return '12 PM';
	if (hour < 12) return `${hour} AM`;
	return `${hour - 12} PM`;
}
