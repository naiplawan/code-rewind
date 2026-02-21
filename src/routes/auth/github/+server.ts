import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import {
	storeOAuthState,
	generateCodeVerifier,
	generateCodeChallenge,
	OAUTH_CONFIG
} from '$lib/server/oauth';
import { isGitHubConfigured, logOAuthEvent, getSecureCookieSetting } from '$lib/server/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check if GitHub is configured
	if (!isGitHubConfigured()) {
		logOAuthEvent('github', 'not_configured', {});
		throw redirect(302, '/?error=github_not_configured');
	}

	// Generate CSRF state token
	const state = crypto.randomUUID();

	// Generate PKCE code verifier and challenge for enhanced security
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	// Store state and PKCE verifier in cookie
	storeOAuthState(cookies, 'github', state, codeVerifier);

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: `${PUBLIC_APP_URL}/auth/github/callback`,
		scope: 'read:user repo',
		state,
		// Note: GitHub supports PKCE but doesn't require it by default
		// Including code_challenge for enhanced security
		code_challenge: codeChallenge,
		code_challenge_method: 'S256'
	});

	logOAuthEvent('github', 'redirect_to_provider', {
		redirectUri: `${PUBLIC_APP_URL}/auth/github/callback`
	});

	throw redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
