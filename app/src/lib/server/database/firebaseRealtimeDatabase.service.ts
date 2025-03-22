import admin from 'firebase-admin';
import { initializeApp, type App } from 'firebase-admin/app';
import serviceAccount from './grow-run-archive-firebase-adminsdk-credentials.json';
import { getDatabase, type Reference } from 'firebase-admin/database';
import { error } from '@sveltejs/kit';
import { getUser } from '../auth';

let app: App | undefined = undefined;
if (!admin.apps.length) {
	app = initializeApp({
		credential: admin.credential.cert(serviceAccount as any),
		databaseURL: 'https://grow-run-archive-default-rtdb.asia-southeast1.firebasedatabase.app'
	});
}

const database = getDatabase(app);

export class FirebaseRealtimeDatabaseService {
	async recordEnvironmentConditions(
		username: string,
		password: string,
		growRunId: string,
		dateTime: string,
		environmentalConditions: { [environmentalConditionName: string]: any }
	) {
		if (!growRunId)
			throw error(
				400,
				'Grow Run ID was not provided. No idea which grow run has these measured environmental conditions.'
			);

		if (!dateTime)
			throw error(
				400,
				'Datetime was not provided. No idea when this grow run had these environmental conditions.'
			);

		const user = await getUser(username, password);
		if (!user) throw error(401, 'User not authenticated');

		const conditions: Reference = database.ref(`${user.localId}/grow-runs/${growRunId}/conditions`);

		await Promise.all(
			Object.entries(environmentalConditions).map(([conditionName, conditionValue]) =>
				conditions.child(conditionName).push({ dateTime, value: conditionValue })
			)
		);
	}
}
