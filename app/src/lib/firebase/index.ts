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
import type { Firestore } from 'firebase/firestore';
import { session } from './user';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		return auth.onAuthStateChanged((user) => session.set({ user, loading: false }));
	}
};
