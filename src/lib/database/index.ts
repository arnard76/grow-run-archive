import { derived } from 'svelte/store';
import { Database, getDatabase } from 'firebase/database';
import { app } from '$lib/firebase';
export const db = derived(app, (app, setDb: (d?: Database) => void) =>
	setDb(app ? getDatabase(app) : undefined)
);
