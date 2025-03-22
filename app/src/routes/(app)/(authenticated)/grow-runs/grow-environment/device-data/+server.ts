import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';
import { FirebaseRealtimeDatabaseService } from '$lib/server/database/firebaseRealtimeDatabase.service';

export const POST: RequestHandler = async ({ url, request }) => {
	const deviceData = await request.json();
	console.log({ deviceData });
	const { dateTime, user, growRunId, ...environmentReadings } = deviceData;

	if (!user || !user.username || !user.password) {
		error(401);
	}

	// Upload to database
	try {
		await new FirebaseRealtimeDatabaseService().recordEnvironmentConditions(
			user.username,
			user.password,
			growRunId,
			dateTime,
			environmentReadings
		);
	} catch (e) {
		return error(400, `Something went wrong: ${e}`);
	}

	return text('Device data has been recieved', { status: 201 });
};
