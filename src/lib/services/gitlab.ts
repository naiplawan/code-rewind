import type { User, PlatformStats, LanguageStat, RepoStat, ContributionDay, GitLabEvent, GitLabProject } from '$lib/types';

const GITLAB_API_URL = 'https://gitlab.com/api/v4';

export async function fetchGitLabUser(token: string): Promise<User | null> {
	try {
		const response = await fetch(`${GITLAB_API_URL}/user`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) return null;

		const data = await response.json();
		return {
			id: String(data.id),
			username: data.username,
			name: data.name || data.username,
			avatarUrl: data.avatar_url,
			platform: 'gitlab'
		};
	} catch {
		return null;
	}
}

export async function fetchGitLabStats(token: string, userId: string): Promise<PlatformStats | null> {
	try {
		// Fetch user events for 2025
		const events = await fetchAllEvents(token, userId);

		// Calculate commit count from push events
		let commits = 0;
		let mergeRequests = 0;
		let issues = 0;

		const contributionsByDate: Record<string, number> = {};

		for (const event of events) {
			const eventDate = event.created_at.split('T')[0];

			if (event.action_name === 'pushed to' || event.action_name === 'pushed new') {
				const pushCommits = event.push_data?.commit_count || 1;
				commits += pushCommits;
				contributionsByDate[eventDate] = (contributionsByDate[eventDate] || 0) + pushCommits;
			} else if (event.target_type === 'MergeRequest') {
				if (event.action_name === 'opened' || event.action_name === 'accepted') {
					mergeRequests++;
					contributionsByDate[eventDate] = (contributionsByDate[eventDate] || 0) + 1;
				}
			} else if (event.target_type === 'Issue') {
				if (event.action_name === 'opened' || event.action_name === 'closed') {
					issues++;
					contributionsByDate[eventDate] = (contributionsByDate[eventDate] || 0) + 1;
				}
			}
		}

		// Fetch user projects and their languages
		const projects = await fetchUserProjects(token);
		const languageTotals: Record<string, number> = {};
		const repoCommits: Record<string, { name: string; commits: number; url: string }> = {};

		for (const project of projects) {
			// Fetch languages for each project
			const languages = await fetchProjectLanguages(token, project.id);
			for (const [lang, bytes] of Object.entries(languages)) {
				languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
			}

			// Count commits per project from events
			const projectCommits = events.filter(
				(e) =>
					(e.action_name === 'pushed to' || e.action_name === 'pushed new') &&
					e.project_id === project.id
			).length;

			if (projectCommits > 0) {
				repoCommits[project.id] = {
					name: project.name,
					commits: projectCommits,
					url: project.web_url
				};
			}
		}

		// Convert language totals to percentages
		const totalSize = Object.values(languageTotals).reduce((sum, size) => sum + size, 0);
		const topLanguages: LanguageStat[] = Object.entries(languageTotals)
			.map(([name, size]) => ({
				name,
				percentage: Math.round((size / totalSize) * 100 * 10) / 10,
				color: getLanguageColor(name)
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 5);

		// Sort repos by commit count
		const topRepos: RepoStat[] = Object.values(repoCommits)
			.map((repo) => ({
				...repo,
				platform: 'gitlab' as const
			}))
			.sort((a, b) => b.commits - a.commits)
			.slice(0, 5);

		return {
			commits,
			prs: mergeRequests,
			issues,
			reviews: 0, // GitLab doesn't expose review counts easily
			topRepos,
			languages: topLanguages
		};
	} catch {
		return null;
	}
}

async function fetchAllEvents(token: string, userId: string): Promise<GitLabEvent[]> {
	const allEvents: GitLabEvent[] = [];
	let page = 1;
	const perPage = 100;
	const startDate = '2025-01-01';
	const endDate = '2025-12-31';

	while (true) {
		const response = await fetch(
			`${GITLAB_API_URL}/users/${userId}/events?per_page=${perPage}&page=${page}&after=${startDate}&before=${endDate}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		if (!response.ok) break;

		const events: GitLabEvent[] = await response.json();
		if (events.length === 0) break;

		// Filter events to 2025 only
		const events2025 = events.filter((e) => {
			const year = new Date(e.created_at).getFullYear();
			return year === 2025;
		});

		allEvents.push(...events2025);

		// If we got fewer events than requested, we've reached the end
		if (events.length < perPage) break;

		// Safety limit to prevent infinite loops
		if (page >= 20) break;

		page++;
	}

	return allEvents;
}

async function fetchUserProjects(token: string): Promise<GitLabProject[]> {
	try {
		const response = await fetch(
			`${GITLAB_API_URL}/projects?membership=true&per_page=100&order_by=last_activity_at`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		if (!response.ok) return [];
		return response.json();
	} catch {
		return [];
	}
}

async function fetchProjectLanguages(token: string, projectId: number): Promise<Record<string, number>> {
	try {
		const response = await fetch(`${GITLAB_API_URL}/projects/${projectId}/languages`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!response.ok) return {};
		return response.json();
	} catch {
		return {};
	}
}

export async function fetchGitLabContributionCalendar(
	token: string,
	userId: string
): Promise<ContributionDay[]> {
	const events = await fetchAllEvents(token, userId);
	const contributionsByDate: Record<string, number> = {};

	for (const event of events) {
		const date = event.created_at.split('T')[0];
		contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
	}

	return Object.entries(contributionsByDate).map(([date, count]) => ({
		date,
		count
	}));
}

// Simple language color mapping
function getLanguageColor(language: string): string {
	const colors: Record<string, string> = {
		JavaScript: '#f1e05a',
		TypeScript: '#3178c6',
		Python: '#3572A5',
		Java: '#b07219',
		'C++': '#f34b7d',
		C: '#555555',
		'C#': '#178600',
		Go: '#00ADD8',
		Rust: '#dea584',
		Ruby: '#701516',
		PHP: '#4F5D95',
		Swift: '#F05138',
		Kotlin: '#A97BFF',
		Scala: '#c22d40',
		HTML: '#e34c26',
		CSS: '#563d7c',
		SCSS: '#c6538c',
		Vue: '#41b883',
		Svelte: '#ff3e00',
		Shell: '#89e051',
		Dockerfile: '#384d54'
	};

	return colors[language] || '#858585';
}
