// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDHtx9L1l0839dQgk2rmHwoso2Ud20GmsM',
	authDomain: 'grow-run-archive.firebaseapp.com',
	projectId: 'grow-run-archive',
	storageBucket: 'grow-run-archive.appspot.com',
	messagingSenderId: '1092699981645',
	appId: '1:1092699981645:web:c31f1619a1207f6eead904',

	databaseURL: ' https://grow-run-archive-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { browser } from '$app/environment';
import { session } from '../user/user';
import { writable, derived, get } from 'svelte/store';
import { Database, getDatabase } from 'firebase/database';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let app = writable<FirebaseApp | undefined>(undefined);
export const db = derived(
	app,
	(app, setDb: (d: Database) => void) => app && setDb(getDatabase(app))
);
export const auth = derived(app, (app, setAuth: (d: Auth) => void) => app && setAuth(getAuth(app)));
export const storage = derived(
	app,
	(app, setStorage: (d: FirebaseStorage) => void) => app && setStorage(getStorage(app))
);

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!get(app)) {
		app.set(initializeApp(firebaseConfig));

		return getAuth(get(app)).onAuthStateChanged((user) => session.set({ user, loading: false }));
	}
};
