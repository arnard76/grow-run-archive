import { derived } from 'svelte/store';
import { connectDatabaseEmulator, Database, getDatabase } from 'firebase/database';
import { app } from '$lib/firebase';
import { env } from '$env/dynamic/public';

export const db = derived<typeof app, Database | undefined>(app, (app, setDb) => {
	if (!app) return setDb(undefined);

	const database = getDatabase(app);

	if (env.ENV === 'test' && env.FIREBASE_DATABASE_EMULATOR_HOST) {
		const [host, port] = env.FIREBASE_DATABASE_EMULATOR_HOST.split(':');
		connectDatabaseEmulator(database, host, parseInt(port));
	}

	setDb(database);
});
