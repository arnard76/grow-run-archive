import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG);

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

export const app = writable<FirebaseApp | undefined>(undefined);

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!get(app)) {
		app.set(initializeApp(firebaseConfig));
	}
};
