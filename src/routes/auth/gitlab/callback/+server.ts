import { redirect } from '@sveltejs/kit';
import { GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	// Validate CSRF state
	const storedState = cookies.get('gitlab_oauth_state');
	cookies.delete('gitlab_oauth_state', { path: '/' });

	if (!state || !storedState || state !== storedState) {
		throw redirect(302, '/?error=gitlab_auth_failed');
	}

	if (error || !code) {
		throw redirect(302, '/?error=gitlab_auth_failed');
	}

	// Validate code format
	if (typeof code !== 'string' || code.length === 0 || code.length > 100) {
		throw redirect(302, '/?error=gitlab_auth_failed');
	}

	try {
		// Exchange code for access token
		const tokenResponse = await fetch('https://gitlab.com/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				client_id: GITLAB_CLIENT_ID,
				client_secret: GITLAB_CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: `${PUBLIC_APP_URL}/auth/gitlab/callback`
			})
		});

		const tokenData = await tokenResponse.json();

		if (tokenData.error || !tokenData.access_token) {
			throw redirect(302, '/?error=gitlab_token_failed');
		}

		// Store token in secure HTTP-only cookie
		cookies.set('gitlab_token', tokenData.access_token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		throw redirect(302, '/wrapped');
	} catch (err) {
		// Re-throw redirects
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err;
		}
		throw redirect(302, '/?error=gitlab_auth_error');
	}
};
