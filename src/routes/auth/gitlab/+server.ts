import { redirect } from '@sveltejs/kit';
import { GITLAB_CLIENT_ID } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Generate CSRF state token
	const state = crypto.randomUUID();

	// Store state in cookie for validation in callback
	cookies.set('gitlab_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	const params = new URLSearchParams({
		client_id: GITLAB_CLIENT_ID,
		redirect_uri: `${PUBLIC_APP_URL}/auth/gitlab/callback`,
		response_type: 'code',
		scope: 'read_user read_api read_repository',
		state
	});

	throw redirect(302, `https://gitlab.com/oauth/authorize?${params}`);
};
