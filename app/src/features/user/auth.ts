import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { derived } from 'svelte/store';
import { app } from '$lib/firebase';
import { session } from './session';
import { env } from '$env/dynamic/public';

export const auth = derived<typeof app, Auth | undefined>(app, (app, setAuth) => {
	if (!app) {
		setAuth(undefined);
		return;
	}
	const auth = getAuth(app);

	if (env.ENV === 'test' && env.FIREBASE_AUTH_EMULATOR_HOST) {
		const authEmulatorUrl = `http://${env.FIREBASE_AUTH_EMULATOR_HOST}`;
		connectAuthEmulator(auth, authEmulatorUrl);
	}

	setAuth(auth);
	return auth.onAuthStateChanged((user) => session.set({ user, loading: false }));
});

export function isValidPassword(password: string) {
	const passwordRegex = /(?=.*[0-9a-zA-Z]).{7,30}/;
	return passwordRegex.test(password);
}
