import { redirect } from '@sveltejs/kit';
import { GITLAB_CLIENT_ID } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import {
	storeOAuthState,
	generateCodeVerifier,
	generateCodeChallenge
} from '$lib/server/oauth';
import { isGitLabConfigured, logOAuthEvent } from '$lib/server/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check if GitLab is properly configured
	if (!isGitLabConfigured()) {
		logOAuthEvent('gitlab', 'not_configured', {});
		throw redirect(302, '/?error=gitlab_not_configured&message=GitLab+integration+is+not+configured');
	}

	// Generate CSRF state token
	const state = crypto.randomUUID();

	// Generate PKCE code verifier and challenge for enhanced security
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	// Store state and PKCE verifier in cookie
	storeOAuthState(cookies, 'gitlab', state, codeVerifier);

	const params = new URLSearchParams({
		client_id: GITLAB_CLIENT_ID,
		redirect_uri: `${PUBLIC_APP_URL}/auth/gitlab/callback`,
		response_type: 'code',
		scope: 'read_user read_api read_repository',
		state,
		// PKCE for enhanced security
		code_challenge: codeChallenge,
		code_challenge_method: 'S256'
	});

	logOAuthEvent('gitlab', 'redirect_to_provider', {
		redirectUri: `${PUBLIC_APP_URL}/auth/gitlab/callback`
	});

	throw redirect(302, `https://gitlab.com/oauth/authorize?${params}`);
};
