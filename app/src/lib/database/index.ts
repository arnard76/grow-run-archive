import { derived } from 'svelte/store';
import { connectDatabaseEmulator, Database, getDatabase } from 'firebase/database';
import { app } from '$lib/firebase';
import { PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST, PUBLIC_ENV } from '$env/static/public';

export const db = derived<typeof app, Database | undefined>(app, (app, setDb) => {
	if (!app) return setDb(undefined);

	const database = getDatabase(app);

	if (PUBLIC_ENV === 'test') {
		const [host, port] = PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST.split(':');
		connectDatabaseEmulator(database, host, parseInt(port));
	}

	setDb(database);
});
