import { getSecureCookieSetting, logOAuthEvent } from './env';
import type { Cookies } from '@sveltejs/kit';

// OAuth configuration constants
export const OAUTH_CONFIG = {
	STATE_COOKIE_MAX_AGE: 60 * 5, // 5 minutes (reduced for security)
	TOKEN_COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	REFRESH_TOKEN_MAX_AGE: 60 * 60 * 24 * 30, // 30 days
	PKCE_CODE_VERIFIER_LENGTH: 64
} as const;

// Cookie options factory
export function getAuthCookieOptions(additionalOptions?: {
	maxAge?: number;
	sameSite?: 'lax' | 'strict' | 'none';
}) {
	return {
		path: '/',
		httpOnly: true,
		secure: getSecureCookieSetting(),
		sameSite: (additionalOptions?.sameSite as 'lax' | 'strict' | 'none') || 'lax',
		maxAge: additionalOptions?.maxAge || OAUTH_CONFIG.STATE_COOKIE_MAX_AGE
	};
}

// Generate PKCE code verifier
export function generateCodeVerifier(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return base64URLEncode(array);
}

// Generate PKCE code challenge from verifier
export async function generateCodeChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return base64URLEncode(new Uint8Array(digest));
}

// Base64 URL encode
function base64URLEncode(buffer: Uint8Array): string {
	return btoa(String.fromCharCode(...buffer))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

// Store OAuth state with optional PKCE verifier
export function storeOAuthState(
	cookies: Cookies,
	provider: 'github' | 'gitlab',
	state: string,
	codeVerifier?: string
): void {
	const cookieName = `${provider}_oauth_state`;
	const value = codeVerifier ? `${state}:${codeVerifier}` : state;

	cookies.set(cookieName, value, {
		...getAuthCookieOptions({ maxAge: OAUTH_CONFIG.STATE_COOKIE_MAX_AGE })
	});

	logOAuthEvent(provider, 'state_stored', { hasPKCE: !!codeVerifier });
}

// Retrieve and validate OAuth state
export function validateOAuthState(
	cookies: Cookies,
	provider: 'github' | 'gitlab',
	state: string | null
): { valid: boolean; codeVerifier?: string } {
	const cookieName = `${provider}_oauth_state`;
	const storedValue = cookies.get(cookieName);

	// Delete the state cookie after reading
	cookies.delete(cookieName, { path: '/' });

	if (!storedValue) {
		logOAuthEvent(provider, 'state_missing', {});
		return { valid: false };
	}

	// Check if PKCE was used (value contains colon separator)
	const [storedState, codeVerifier] = storedValue.split(':');

	if (!state || state !== storedState) {
		logOAuthEvent(provider, 'state_mismatch', {
			provided: state?.substring(0, 8) + '...',
			expected: storedState?.substring(0, 8) + '...'
		});
		return { valid: false };
	}

	logOAuthEvent(provider, 'state_validated', { hasPKCE: !!codeVerifier });
	return { valid: true, codeVerifier };
}

// Store access token securely
export function storeAccessToken(
	cookies: Cookies,
	provider: 'github' | 'gitlab',
	token: string,
	expiresIn?: number
): void {
	const cookieName = `${provider}_token`;
	const maxAge = expiresIn || OAUTH_CONFIG.TOKEN_COOKIE_MAX_AGE;

	cookies.set(cookieName, token, {
		...getAuthCookieOptions({
			maxAge,
			sameSite: 'strict'
		})
	});

	logOAuthEvent(provider, 'token_stored', { expiresIn: maxAge });
}

// Store refresh token securely
export function storeRefreshToken(
	cookies: Cookies,
	provider: 'github' | 'gitlab',
	token: string
): void {
	const cookieName = `${provider}_refresh_token`;

	cookies.set(cookieName, token, {
		...getAuthCookieOptions({
			maxAge: OAUTH_CONFIG.REFRESH_TOKEN_MAX_AGE,
			sameSite: 'strict'
		})
	});

	logOAuthEvent(provider, 'refresh_token_stored', {});
}

// Get stored token
export function getStoredToken(cookies: Cookies, provider: 'github' | 'gitlab'): string | undefined {
	return cookies.get(`${provider}_token`);
}

// Get stored refresh token
export function getStoredRefreshToken(
	cookies: Cookies,
	provider: 'github' | 'gitlab'
): string | undefined {
	return cookies.get(`${provider}_refresh_token`);
}

// Clear all tokens for a provider
export function clearTokens(cookies: Cookies, provider: 'github' | 'gitlab'): void {
	cookies.delete(`${provider}_token`, { path: '/' });
	cookies.delete(`${provider}_refresh_token`, { path: '/' });
	logOAuthEvent(provider, 'tokens_cleared', {});
}

// OAuth error types for better error handling
export type OAuthErrorType =
	| 'state_mismatch'
	| 'access_denied'
	| 'invalid_code'
	| 'token_exchange_failed'
	| 'network_error'
	| 'unknown_error';

export interface OAuthError {
	type: OAuthErrorType;
	provider: 'github' | 'gitlab';
	message: string;
	details?: unknown;
}

export function createOAuthError(
	provider: 'github' | 'gitlab',
	type: OAuthErrorType,
	details?: unknown
): OAuthError {
	const messages: Record<OAuthErrorType, string> = {
		state_mismatch: 'Security validation failed. Please try again.',
		access_denied: 'Access was denied. Please authorize the application to continue.',
		invalid_code: 'Invalid authorization code. Please try again.',
		token_exchange_failed: 'Failed to obtain access token. Please try again.',
		network_error: 'Network error occurred. Please check your connection and try again.',
		unknown_error: 'An unexpected error occurred. Please try again.'
	};

	logOAuthEvent(provider, 'error', { type, details });

	return {
		type,
		provider,
		message: messages[type],
		details
	};
}

// Get redirect URL with error
export function getErrorRedirect(error: OAuthError): string {
	return `/?error=${error.provider}_${error.type}&message=${encodeURIComponent(error.message)}`;
}
