import { writable, derived } from 'svelte/store';
import type { UserStats } from '$lib/types';

const initialStats: UserStats = {
	totalCommits: 0,
	totalPRs: 0,
	totalIssues: 0,
	totalReviews: 0,
	linesAdded: 0,
	linesDeleted: 0,
	topLanguages: [],
	topRepos: [],
	contributionCalendar: [],
	productivityPatterns: [],
	longestStreak: 0,
	longestStreakStart: '',
	longestStreakEnd: '',
	currentStreak: 0,
	mostProductiveDay: '',
	mostProductiveHour: 0,
	personality: {
		type: 'unknown',
		title: 'Unknown',
		description: '',
		icon: ''
	},
	githubStats: null,
	gitlabStats: null
};

function createStatsStore() {
	const { subscribe, set, update } = writable<UserStats>(initialStats);
	const loading = writable(false);
	const error = writable<string | null>(null);

	return {
		subscribe,
		loading,
		error,
		setStats: (stats: UserStats) => set(stats),
		updateStats: (partial: Partial<UserStats>) => {
			update((current) => ({ ...current, ...partial }));
		},
		setLoading: (isLoading: boolean) => loading.set(isLoading),
		setError: (err: string | null) => error.set(err),
		reset: () => {
			set(initialStats);
			loading.set(false);
			error.set(null);
		}
	};
}

export const stats = createStatsStore();

// Derived store to check if we have any data
export const hasStats = derived(stats, ($stats) => $stats.totalCommits > 0);
