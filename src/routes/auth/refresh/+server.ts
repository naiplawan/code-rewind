import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import {
	getStoredRefreshToken,
	storeAccessToken,
	storeRefreshToken,
	clearTokens
} from '$lib/server/oauth';
import { logOAuthEvent, isGitLabConfigured } from '$lib/server/env';
import { GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET } from '$env/static/private';

interface GitLabRefreshResponse {
	access_token: string;
	token_type: string;
	scope: string;
	created_at: number;
	refresh_token?: string;
	expires_in?: number;
	error?: string;
	error_description?: string;
}

export async function POST({ cookies, request }: RequestEvent) {
	const body = await request.json();
	const provider = body.provider as 'github' | 'gitlab';

	if (!provider || !['github', 'gitlab'].includes(provider)) {
		throw error(400, 'Invalid provider');
	}

	// GitHub OAuth tokens don't expire, so no refresh needed
	if (provider === 'github') {
		return json({ success: true, message: 'GitHub tokens do not expire' });
	}

	// GitLab token refresh
	if (provider === 'gitlab') {
		if (!isGitLabConfigured()) {
			throw error(400, 'GitLab integration is not configured');
		}

		const refreshToken = getStoredRefreshToken(cookies, 'gitlab');

		if (!refreshToken) {
			throw error(400, 'No refresh token available');
		}

		try {
			logOAuthEvent('gitlab', 'token_refresh_start', {});

			const response = await fetch('https://gitlab.com/oauth/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					client_id: GITLAB_CLIENT_ID,
					client_secret: GITLAB_CLIENT_SECRET,
					refresh_token: refreshToken,
					grant_type: 'refresh_token'
				})
			});

			if (!response.ok) {
				logOAuthEvent('gitlab', 'token_refresh_failed', {
					status: response.status
				});
				clearTokens(cookies, 'gitlab');
				throw error(401, 'Token refresh failed');
			}

			const data: GitLabRefreshResponse = await response.json();

			if (data.error) {
				logOAuthEvent('gitlab', 'token_refresh_error', {
					error: data.error
				});
				clearTokens(cookies, 'gitlab');
				throw error(401, data.error_description || data.error);
			}

			// Store new tokens
			const expiresIn = data.expires_in || 7200;
			storeAccessToken(cookies, 'gitlab', data.access_token, expiresIn);

			if (data.refresh_token) {
				storeRefreshToken(cookies, 'gitlab', data.refresh_token);
			}

			logOAuthEvent('gitlab', 'token_refresh_success', {
				expiresIn
			});

			return json({
				success: true,
				expiresIn
			});
		} catch (err) {
			if (err instanceof Error && err.message.includes('Token refresh')) {
				throw err;
			}
			logOAuthEvent('gitlab', 'token_refresh_error', {
				error: err instanceof Error ? err.message : 'Unknown error'
			});
			clearTokens(cookies, 'gitlab');
			throw error(500, 'Token refresh failed');
		}
	}

	throw error(400, 'Invalid provider');
};
