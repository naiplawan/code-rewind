import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Clear all authentication tokens
	cookies.delete('github_token', { path: '/' });
	cookies.delete('gitlab_token', { path: '/' });
	cookies.delete('github_oauth_state', { path: '/' });
	cookies.delete('gitlab_oauth_state', { path: '/' });

	throw redirect(302, '/');
};

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear all authentication tokens
	cookies.delete('github_token', { path: '/' });
	cookies.delete('gitlab_token', { path: '/' });
	cookies.delete('github_oauth_state', { path: '/' });
	cookies.delete('gitlab_oauth_state', { path: '/' });

	throw redirect(302, '/');
};
