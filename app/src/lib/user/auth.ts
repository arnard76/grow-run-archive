import { getAuth, type Auth } from 'firebase/auth';
import { derived } from 'svelte/store';
import { app } from '$lib/firebase';

export const auth = derived(app, (app, setAuth: (d: Auth) => void) => app && setAuth(getAuth(app)));

export function isValidPassword(password: string) {
	if (password.length < 7 || password.length > 30) return false;

	return true;
}
