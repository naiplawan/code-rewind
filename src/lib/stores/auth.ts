import { writable } from 'svelte/store';
import type { AuthState, User } from '$lib/types';

const initialState: AuthState = {
	github: {
		accessToken: null,
		user: null
	},
	gitlab: {
		accessToken: null,
		user: null
	}
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		setGitHubAuth: (token: string, user: User) => {
			update((state) => ({
				...state,
				github: { accessToken: token, user }
			}));
		},
		setGitLabAuth: (token: string, user: User) => {
			update((state) => ({
				...state,
				gitlab: { accessToken: token, user }
			}));
		},
		clearGitHub: () => {
			update((state) => ({
				...state,
				github: { accessToken: null, user: null }
			}));
		},
		clearGitLab: () => {
			update((state) => ({
				...state,
				gitlab: { accessToken: null, user: null }
			}));
		},
		reset: () => set(initialState),
		isConnected: (platform: 'github' | 'gitlab') => {
			let connected = false;
			subscribe((state) => {
				connected = state[platform].accessToken !== null;
			})();
			return connected;
		}
	};
}

export const auth = createAuthStore();
