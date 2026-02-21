import { redirect } from '@sveltejs/kit';
import { GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import {
	validateOAuthState,
	storeAccessToken,
	storeRefreshToken,
	createOAuthError,
	getErrorRedirect
} from '$lib/server/oauth';
import { logOAuthEvent, isGitLabConfigured } from '$lib/server/env';
import type { RequestHandler } from './$types';

interface GitLabTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	created_at: number;
	refresh_token?: string;
	expires_in?: number;
	error?: string;
	error_description?: string;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	// Check if GitLab is properly configured
	if (!isGitLabConfigured()) {
		throw redirect(302, '/?error=gitlab_not_configured&message=GitLab+integration+is+not+configured');
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	// Handle OAuth error from GitLab
	if (error) {
		const oauthError = createOAuthError(
			'gitlab',
			error === 'access_denied' ? 'access_denied' : 'unknown_error',
			{ error, errorDescription }
		);
		throw redirect(302, getErrorRedirect(oauthError));
	}

	// Validate code format
	if (!code || typeof code !== 'string' || code.length === 0 || code.length > 200) {
		const oauthError = createOAuthError('gitlab', 'invalid_code', { codeLength: code?.length });
		throw redirect(302, getErrorRedirect(oauthError));
	}

	// Validate CSRF state and get PKCE verifier if present
	const stateValidation = validateOAuthState(cookies, 'gitlab', state);
	if (!stateValidation.valid) {
		const oauthError = createOAuthError('gitlab', 'state_mismatch');
		throw redirect(302, getErrorRedirect(oauthError));
	}

	try {
		logOAuthEvent('gitlab', 'token_exchange_start', {});

		// Build token request body
		const tokenRequestBody: Record<string, string> = {
			client_id: GITLAB_CLIENT_ID,
			client_secret: GITLAB_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: `${PUBLIC_APP_URL}/auth/gitlab/callback`
		};

		// Include PKCE code verifier
		if (stateValidation.codeVerifier) {
			tokenRequestBody.code_verifier = stateValidation.codeVerifier;
		}

		// Exchange code for access token
		const tokenResponse = await fetch('https://gitlab.com/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(tokenRequestBody)
		});

		if (!tokenResponse.ok) {
			logOAuthEvent('gitlab', 'token_response_error', {
				status: tokenResponse.status,
				statusText: tokenResponse.statusText
			});
			const oauthError = createOAuthError('gitlab', 'token_exchange_failed', {
				status: tokenResponse.status
			});
			throw redirect(302, getErrorRedirect(oauthError));
		}

		const tokenData: GitLabTokenResponse = await tokenResponse.json();

		if (tokenData.error || !tokenData.access_token) {
			logOAuthEvent('gitlab', 'token_data_error', {
				error: tokenData.error,
				errorDescription: tokenData.error_description
			});
			const oauthError = createOAuthError('gitlab', 'token_exchange_failed', {
				error: tokenData.error,
				description: tokenData.error_description
			});
			throw redirect(302, getErrorRedirect(oauthError));
		}

		// Store access token securely
		// GitLab tokens typically expire in 2 hours (7200 seconds)
		const expiresIn = tokenData.expires_in || 7200;
		storeAccessToken(cookies, 'gitlab', tokenData.access_token, expiresIn);

		// Store refresh token if provided
		if (tokenData.refresh_token) {
			storeRefreshToken(cookies, 'gitlab', tokenData.refresh_token);
		}

		logOAuthEvent('gitlab', 'auth_success', {
			hasRefreshToken: !!tokenData.refresh_token,
			scope: tokenData.scope,
			expiresIn
		});

		// Redirect to the wrapped page
		throw redirect(302, '/wrapped');
	} catch (err) {
		// Re-throw redirects (they're not actual errors)
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err;
		}

		// Log unexpected errors
		logOAuthEvent('gitlab', 'unexpected_error', {
			error: err instanceof Error ? err.message : 'Unknown error'
		});

		const oauthError = createOAuthError('gitlab', 'unknown_error', err);
		throw redirect(302, getErrorRedirect(oauthError));
	}
};
