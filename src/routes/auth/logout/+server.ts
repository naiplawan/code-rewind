import { redirect } from '@sveltejs/kit';
import { clearTokens } from '$lib/server/oauth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Clear all OAuth tokens and state
	clearTokens(cookies, 'github');
	clearTokens(cookies, 'gitlab');

	// Also clear any remaining state cookies
	cookies.delete('github_oauth_state', { path: '/' });
	cookies.delete('gitlab_oauth_state', { path: '/' });

	throw redirect(302, '/?logged_out=true');
};

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear all OAuth tokens and state
	clearTokens(cookies, 'github');
	clearTokens(cookies, 'gitlab');

	// Also clear any remaining state cookies
	cookies.delete('github_oauth_state', { path: '/' });
	cookies.delete('gitlab_oauth_state', { path: '/' });

	throw redirect(302, '/?logged_out=true');
};
