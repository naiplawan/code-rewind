import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import {
	validateOAuthState,
	storeAccessToken,
	storeRefreshToken,
	createOAuthError,
	getErrorRedirect,
	OAUTH_CONFIG
} from '$lib/server/oauth';
import { logOAuthEvent, isGitHubConfigured } from '$lib/server/env';
import type { RequestHandler } from './$types';

interface GitHubTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	error?: string;
	error_description?: string;
	refresh_token?: string;
	expires_in?: number;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	// Check if GitHub is configured
	if (!isGitHubConfigured()) {
		throw redirect(302, '/?error=github_not_configured');
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	// Handle OAuth error from GitHub
	if (error) {
		const oauthError = createOAuthError(
			'github',
			error === 'access_denied' ? 'access_denied' : 'unknown_error',
			{ error, errorDescription }
		);
		throw redirect(302, getErrorRedirect(oauthError));
	}

	// Validate code format
	if (!code || typeof code !== 'string' || code.length === 0 || code.length > 200) {
		const oauthError = createOAuthError('github', 'invalid_code', { codeLength: code?.length });
		throw redirect(302, getErrorRedirect(oauthError));
	}

	// Validate CSRF state and get PKCE verifier if present
	const stateValidation = validateOAuthState(cookies, 'github', state);
	if (!stateValidation.valid) {
		const oauthError = createOAuthError('github', 'state_mismatch');
		throw redirect(302, getErrorRedirect(oauthError));
	}

	try {
		logOAuthEvent('github', 'token_exchange_start', {});

		// Exchange code for access token
		const tokenRequestBody: Record<string, string> = {
			client_id: GITHUB_CLIENT_ID,
			client_secret: GITHUB_CLIENT_SECRET,
			code,
			redirect_uri: `${PUBLIC_APP_URL}/auth/github/callback`
		};

		// Include PKCE code verifier if it was used
		if (stateValidation.codeVerifier) {
			tokenRequestBody.code_verifier = stateValidation.codeVerifier;
		}

		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'CodeRewind-OAuth'
			},
			body: JSON.stringify(tokenRequestBody)
		});

		if (!tokenResponse.ok) {
			logOAuthEvent('github', 'token_response_error', {
				status: tokenResponse.status,
				statusText: tokenResponse.statusText
			});
			const oauthError = createOAuthError('github', 'token_exchange_failed', {
				status: tokenResponse.status
			});
			throw redirect(302, getErrorRedirect(oauthError));
		}

		const tokenData: GitHubTokenResponse = await tokenResponse.json();

		if (tokenData.error || !tokenData.access_token) {
			logOAuthEvent('github', 'token_data_error', {
				error: tokenData.error,
				errorDescription: tokenData.error_description
			});
			const oauthError = createOAuthError('github', 'token_exchange_failed', {
				error: tokenData.error,
				description: tokenData.error_description
			});
			throw redirect(302, getErrorRedirect(oauthError));
		}

		// Store access token securely
		storeAccessToken(cookies, 'github', tokenData.access_token, tokenData.expires_in);

		// Store refresh token if provided (GitHub Apps may provide this)
		if (tokenData.refresh_token) {
			storeRefreshToken(cookies, 'github', tokenData.refresh_token);
		}

		logOAuthEvent('github', 'auth_success', {
			hasRefreshToken: !!tokenData.refresh_token,
			scope: tokenData.scope
		});

		// Redirect to the wrapped page
		throw redirect(302, '/wrapped');
	} catch (err) {
		// Re-throw redirects (they're not actual errors)
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err;
		}

		// Log unexpected errors
		logOAuthEvent('github', 'unexpected_error', {
			error: err instanceof Error ? err.message : 'Unknown error'
		});

		const oauthError = createOAuthError('github', 'unknown_error', err);
		throw redirect(302, getErrorRedirect(oauthError));
	}
};
