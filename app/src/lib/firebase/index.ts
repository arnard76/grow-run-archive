// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// Initialize Firebase

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { browser } from '$app/environment';
import { session } from '../../features/user/session';
import { writable, get } from 'svelte/store';

export const app = writable<FirebaseApp | undefined>(undefined);

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!get(app)) {
		app.set(initializeApp(firebaseConfig));

		return getAuth(get(app)).onAuthStateChanged((user) => session.set({ user, loading: false }));
	}
};
