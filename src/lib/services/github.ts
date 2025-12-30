import type { User, PlatformStats, LanguageStat, RepoStat, ContributionDay } from '$lib/types';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const CONTRIBUTIONS_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!, $since: GitTimestamp!, $until: GitTimestamp!) {
  user(login: $username) {
    login
    name
    avatarUrl
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        name
        url
        isPrivate
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 0, since: $since, until: $until) {
                totalCount
              }
            }
          }
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
          totalSize
        }
      }
    }
  }
}
`;

export async function fetchGitHubUser(token: string): Promise<User | null> {
	try {
		const response = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});

		if (!response.ok) return null;

		const data = await response.json();
		return {
			id: String(data.id),
			username: data.login,
			name: data.name || data.login,
			avatarUrl: data.avatar_url,
			platform: 'github'
		};
	} catch {
		return null;
	}
}

export async function fetchGitHubStats(token: string, username: string): Promise<PlatformStats | null> {
	try {
		// 2025 date range
		const from = '2025-01-01T00:00:00Z';
		const to = '2025-12-31T23:59:59Z';
		// GitTimestamp format for commit history
		const since = '2025-01-01T00:00:00Z';
		const until = '2025-12-31T23:59:59Z';

		const response = await fetch(GITHUB_GRAPHQL_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: CONTRIBUTIONS_QUERY,
				variables: { username, from, to, since, until }
			})
		});

		if (!response.ok) return null;

		const data = await response.json();

		if (data.errors || !data.data?.user) {
			return null;
		}

		const user = data.data.user;
		const contributions = user.contributionsCollection;

		// Calculate language stats from repositories
		const languageTotals: Record<string, { size: number; color: string }> = {};
		const repoStats: RepoStat[] = [];

		for (const repo of user.repositories.nodes) {
			// Get commit count for this repo in 2025
			const commitCount = repo.defaultBranchRef?.target?.history?.totalCount || 0;

			if (commitCount > 0) {
				repoStats.push({
					name: repo.name,
					commits: commitCount,
					url: repo.url,
					platform: 'github'
				});
			}

			// Aggregate language data
			for (const lang of repo.languages?.edges || []) {
				const name = lang.node.name;
				if (!languageTotals[name]) {
					languageTotals[name] = { size: 0, color: lang.node.color || '#858585' };
				}
				languageTotals[name].size += lang.size;
			}
		}

		// Convert language totals to percentages
		const totalSize = Object.values(languageTotals).reduce((sum, l) => sum + l.size, 0);
		const topLanguages: LanguageStat[] = Object.entries(languageTotals)
			.map(([name, { size, color }]) => ({
				name,
				percentage: Math.round((size / totalSize) * 100 * 10) / 10,
				color
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 5);

		// Sort repos by commit count and get top 5
		const topRepos = repoStats
			.sort((a, b) => b.commits - a.commits)
			.slice(0, 5);

		return {
			commits: contributions.totalCommitContributions + contributions.restrictedContributionsCount,
			prs: contributions.totalPullRequestContributions,
			issues: contributions.totalIssueContributions,
			reviews: contributions.totalPullRequestReviewContributions,
			topRepos,
			languages: topLanguages
		};
	} catch {
		return null;
	}
}

export async function fetchGitHubContributionCalendar(
	token: string,
	username: string
): Promise<ContributionDay[]> {
	try {
		const from = '2025-01-01T00:00:00Z';
		const to = '2025-12-31T23:59:59Z';
		const since = '2025-01-01T00:00:00Z';
		const until = '2025-12-31T23:59:59Z';

		const response = await fetch(GITHUB_GRAPHQL_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: CONTRIBUTIONS_QUERY,
				variables: { username, from, to, since, until }
			})
		});

		if (!response.ok) return [];

		const data = await response.json();
		const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

		if (!calendar) return [];

		const days: ContributionDay[] = [];
		for (const week of calendar.weeks) {
			for (const day of week.contributionDays) {
				days.push({
					date: day.date,
					count: day.contributionCount
				});
			}
		}

		return days;
	} catch {
		return [];
	}
}
