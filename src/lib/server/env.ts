import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITLAB_CLIENT_ID,
	GITLAB_CLIENT_SECRET
} from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';

export interface EnvValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

export function validateEnv(): EnvValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Validate PUBLIC_APP_URL
	if (!PUBLIC_APP_URL) {
		errors.push('PUBLIC_APP_URL is required');
	} else {
		try {
			new URL(PUBLIC_APP_URL);
		} catch {
			errors.push('PUBLIC_APP_URL must be a valid URL');
		}
	}

	// Validate GitHub credentials
	if (!GITHUB_CLIENT_ID) {
		errors.push('GITHUB_CLIENT_ID is required');
	}
	if (!GITHUB_CLIENT_SECRET) {
		errors.push('GITHUB_CLIENT_SECRET is required');
	}

	// Validate GitLab credentials
	if (!GITLAB_CLIENT_ID) {
		warnings.push('GITLAB_CLIENT_ID is not set - GitLab integration will be disabled');
	} else if (GITLAB_CLIENT_ID === 'placeholder') {
		warnings.push('GITLAB_CLIENT_ID is set to placeholder - GitLab integration will not work');
	}

	if (!GITLAB_CLIENT_SECRET) {
		warnings.push('GITLAB_CLIENT_SECRET is not set - GitLab integration will be disabled');
	} else if (GITLAB_CLIENT_SECRET === 'placeholder') {
		warnings.push('GITLAB_CLIENT_SECRET is set to placeholder - GitLab integration will not work');
	}

	// Log warnings in development
	if (warnings.length > 0) {
		console.warn('⚠️ Environment warnings:');
		warnings.forEach((w) => console.warn(`  - ${w}`));
	}

	// Log errors and throw in production
	if (errors.length > 0) {
		console.error('❌ Environment errors:');
		errors.forEach((e) => console.error(`  - ${e}`));

		if (import.meta.env.PROD) {
			throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings
	};
}

// Check if GitLab is properly configured
export function isGitLabConfigured(): boolean {
	return !!(
		GITLAB_CLIENT_ID &&
		GITLAB_CLIENT_SECRET &&
		GITLAB_CLIENT_ID !== 'placeholder' &&
		GITLAB_CLIENT_SECRET !== 'placeholder'
	);
}

// Check if GitHub is properly configured
export function isGitHubConfigured(): boolean {
	return !!(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);
}

// Get cookie secure setting based on environment
export function getSecureCookieSetting(): boolean {
	// In production, always use secure cookies
	// In development, allow non-secure for localhost
	return import.meta.env.PROD || PUBLIC_APP_URL.startsWith('https://');
}

// Log OAuth events for debugging
export function logOAuthEvent(
	provider: 'github' | 'gitlab',
	event: string,
	details?: Record<string, unknown>
): void {
	const timestamp = new Date().toISOString();
	const logEntry = {
		timestamp,
		provider,
		event,
		...details
	};

	if (import.meta.env.DEV) {
		console.log(`🔐 OAuth [${provider}] ${event}:`, logEntry);
	}
}
