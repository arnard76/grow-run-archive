import { EntityAPI } from '$lib/api';
import { db } from '$lib/database';
import { session } from '$lib/user/user';
import * as firebase from 'firebase/database';
import { derived } from 'svelte/store';

export function createDerivedStoreForEntity(EntityClass: any, entityAPI: EntityAPI<any>) {
	function convertToArray(growRunData: { [key: string]: any }): (typeof EntityClass)[] {
		return Object.entries(growRunData || {}).map(
			([key, growRun]: [string, typeof EntityClass]) => new EntityClass({ ...growRun, id: key })
		);
	}

	return derived(
		[session, db],
		([{ user }, $db], setEntities) => {
			setEntities([]);

			const entitiesRef = entityAPI.entityRef('', user?.uid, $db);
			if (!entitiesRef) return;

			return firebase.onValue(entitiesRef, (snapshot) =>
				setEntities(convertToArray(snapshot.val()))
			);
		},
		[] as (typeof EntityClass)[]
	);
}
