import admin from 'firebase-admin';
import { initializeApp, type App } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

let app: App | undefined = undefined;
if (!admin.apps.length) {
	app = initializeApp({
		credential: admin.credential.cert(JSON.parse(process.env.SECRET_FIREBASE_ADMIN_CREDENTIALS!)),
		databaseURL: JSON.parse(process.env.PUBLIC_FIREBASE_CONFIG!).databaseURL
	});
}

export const database = getDatabase(app);
