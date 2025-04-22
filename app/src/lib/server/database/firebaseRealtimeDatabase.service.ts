import admin from 'firebase-admin';
import { initializeApp, type App } from 'firebase-admin/app';
import { getDatabase, type Reference } from 'firebase-admin/database';
import { error } from '@sveltejs/kit';
import { getUser } from '../auth';
import { SECRET_FIREBASE_ADMIN_CREDENTIALS } from '$env/static/private';
import type { ExternalConditionsMeasurements, GrowRun } from '@grow-run-archive/definitions';

let app: App | undefined = undefined;
if (!admin.apps.length) {
	app = initializeApp({
		credential: admin.credential.cert(JSON.parse(SECRET_FIREBASE_ADMIN_CREDENTIALS)),
		databaseURL: 'https://grow-run-archive-default-rtdb.asia-southeast1.firebasedatabase.app'
	});
}

const database = getDatabase(app);

export class FirebaseRealtimeDatabaseService {
	async recordEnvironmentConditions(
		username: string,
		password: string,
		growRunId: GrowRun['id'],
		dateTime: ExternalConditionsMeasurements['dateTime'],
		environmentalConditions: ExternalConditionsMeasurements['conditions']
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
