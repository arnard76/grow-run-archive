import { EntityAPI } from '$lib/api';
import { db } from '$lib/database';
import GrowRun from '$lib/grow-run';
import { session } from '$lib/user/user';
import * as firebase from 'firebase/database';
import { derived } from 'svelte/store';

function convertToArray(growRunData: { [key: string]: any }): GrowRun[] {
	return Object.entries(growRunData || {}).map(
		([key, growRun]: [string, GrowRun]) => new GrowRun({ ...growRun, id: key })
	);
}

export const growRuns = derived(
	[session, db],
	([{ user }, $db], setGrowRuns) => {
		setGrowRuns([]);

		const growRunsRef = growRunsAPI.entityRef('', user?.uid, $db);
		if (!growRunsRef) throw Error("Can't get grow runs");

		return firebase.onValue(growRunsRef, (snapshot) => setGrowRuns(convertToArray(snapshot.val())));
	},
	[] as GrowRun[]
);

class GrowRunsAPI extends EntityAPI<GrowRun> {
	entityName = 'grow-runs';
	entityIdProperty: 'id' = 'id';
}

export const growRunsAPI = new GrowRunsAPI();
