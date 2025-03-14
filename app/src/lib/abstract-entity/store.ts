import { EntityAPI } from '$lib/abstract-entity/api';
import { db } from '$lib/database';
import { session } from '$lib/user/user';
import { onValue } from 'firebase/database';
import { derived } from 'svelte/store';

export function createDerivedStoreForEntity(EntityClass: any, entityAPI: EntityAPI<any>) {
	function convertToArray(entitiesData: { [key: string]: any }): (typeof EntityClass)[] {
		return Object.entries(entitiesData || {}).map(
			([key, entity]: [string, typeof EntityClass]) => new EntityClass({ ...entity, id: key })
		);
	}

	return derived(
		[session, db],
		([{ user }, $db], setEntities) => {
			setEntities([]);

			const entitiesRef = entityAPI.entityRef('', user?.uid, $db);
			if (!entitiesRef) return;

			return onValue(entitiesRef, (snapshot) => setEntities(convertToArray(snapshot.val())));
		},
		[] as (typeof EntityClass)[]
	);
}
