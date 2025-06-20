import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export type SessionState = {
	user: User | null;
	loading?: boolean;
};

export let session = writable({ user: null, loading: false } as SessionState);
