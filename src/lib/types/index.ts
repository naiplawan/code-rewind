// User and Auth types
export interface User {
	id: string;
	username: string;
	name: string;
	avatarUrl: string;
	platform: 'github' | 'gitlab';
}

export interface AuthState {
	github: {
		accessToken: string | null;
		user: User | null;
	};
	gitlab: {
		accessToken: string | null;
		user: User | null;
	};
}

// Stats types
export interface LanguageStat {
	name: string;
	percentage: number;
	color: string;
}

export interface RepoStat {
	name: string;
	commits: number;
	url: string;
	platform: 'github' | 'gitlab';
}

export interface ContributionDay {
	date: string;
	count: number;
}

export interface ProductivityPattern {
	dayOfWeek: number; // 0-6 (Sun-Sat)
	hour: number; // 0-23
	count: number;
}

export interface DeveloperPersonality {
	type: string;
	title: string;
	description: string;
	icon: string;
}

export interface UserStats {
	// Basic counts
	totalCommits: number;
	totalPRs: number;
	totalIssues: number;
	totalReviews: number;
	linesAdded: number;
	linesDeleted: number;

	// Computed insights
	topLanguages: LanguageStat[];
	topRepos: RepoStat[];
	contributionCalendar: ContributionDay[];
	productivityPatterns: ProductivityPattern[];

	// Streak info
	longestStreak: number;
	longestStreakStart: string;
	longestStreakEnd: string;
	currentStreak: number;

	// Computed insights
	mostProductiveDay: string;
	mostProductiveHour: number;
	personality: DeveloperPersonality;

	// Platform breakdown
	githubStats: PlatformStats | null;
	gitlabStats: PlatformStats | null;
}

export interface PlatformStats {
	commits: number;
	prs: number;
	issues: number;
	reviews: number;
	topRepos: RepoStat[];
	languages: LanguageStat[];
}

// Story slide types
export type SlideType =
	| 'intro'
	| 'commits'
	| 'languages'
	| 'repos'
	| 'streak'
	| 'productivity'
	| 'personality'
	| 'summary';

export interface SlideConfig {
	type: SlideType;
	duration: number; // milliseconds for auto-advance
}

// GitHub API types
export interface GitHubContributionsResponse {
	user: {
		contributionsCollection: {
			totalCommitContributions: number;
			totalPullRequestContributions: number;
			totalIssueContributions: number;
			totalPullRequestReviewContributions: number;
			contributionCalendar: {
				totalContributions: number;
				weeks: Array<{
					contributionDays: Array<{
						date: string;
						contributionCount: number;
					}>;
				}>;
			};
		};
		repositories: {
			nodes: Array<{
				name: string;
				url: string;
				languages: {
					edges: Array<{
						size: number;
						node: {
							name: string;
							color: string;
						};
					}>;
				};
			}>;
		};
	};
}

// GitLab API types
export interface GitLabEvent {
	action_name: string;
	created_at: string;
	push_data?: {
		commit_count: number;
	};
	target_type?: string;
}

export interface GitLabProject {
	id: number;
	name: string;
	web_url: string;
	languages?: Record<string, number>;
}
