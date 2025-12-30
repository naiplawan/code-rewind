import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchGitHubUser, fetchGitHubStats, fetchGitHubContributionCalendar } from '$lib/services/github';
import { fetchGitLabUser, fetchGitLabStats, fetchGitLabContributionCalendar } from '$lib/services/gitlab';
import { combineStats } from '$lib/services/analytics';

export const GET: RequestHandler = async ({ cookies }) => {
	const githubToken = cookies.get('github_token');
	const gitlabToken = cookies.get('gitlab_token');

	if (!githubToken && !gitlabToken) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	try {
		let githubStats = null;
		let gitlabStats = null;
		let githubCalendar: { date: string; count: number }[] = [];
		let gitlabCalendar: { date: string; count: number }[] = [];
		let githubUser = null;
		let gitlabUser = null;

		// Fetch GitHub data
		if (githubToken) {
			githubUser = await fetchGitHubUser(githubToken);
			if (githubUser) {
				[githubStats, githubCalendar] = await Promise.all([
					fetchGitHubStats(githubToken, githubUser.username),
					fetchGitHubContributionCalendar(githubToken, githubUser.username)
				]);
			}
		}

		// Fetch GitLab data
		if (gitlabToken) {
			gitlabUser = await fetchGitLabUser(gitlabToken);
			if (gitlabUser) {
				[gitlabStats, gitlabCalendar] = await Promise.all([
					fetchGitLabStats(gitlabToken, gitlabUser.id),
					fetchGitLabContributionCalendar(gitlabToken, gitlabUser.id)
				]);
			}
		}

		// Combine stats from both platforms
		const combinedStats = combineStats(githubStats, gitlabStats, githubCalendar, gitlabCalendar);

		return json({
			stats: combinedStats,
			users: {
				github: githubUser,
				gitlab: gitlabUser
			}
		});
	} catch {
		return json({ error: 'Failed to fetch stats' }, { status: 500 });
	}
};
