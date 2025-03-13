import { app } from '$lib/firebase';
import { type FirebaseStorage, getStorage } from 'firebase/storage';
import { derived } from 'svelte/store';

export const storage = derived(
	app,
	(app, setStorage: (d: FirebaseStorage) => void) => app && setStorage(getStorage(app))
);
