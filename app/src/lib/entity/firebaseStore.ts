import { EntityAPI } from '$lib/entity/api';
import { db } from '$lib/database';
import { session } from '$lib/user/user';
import { onValue } from 'firebase/database';
import { derived, writable, type Readable } from 'svelte/store';

/**
 * Creates two stores to use the entity records or check if its loading
 * @param EntityClass - the class to store the resources as
 * @param entityAPI - the API to
 * @returns [entityRecords, entityRecordsLoading]
 */
export function createEntityStores<EntityClassType>(
	EntityClass: { new (arg?: any): EntityClassType },
	entityAPI: EntityAPI<any>
) {
	function convertToArray(entitiesData: { [key: string]: any }) {
		return Object.entries(entitiesData || {}).map(
			([key, entity]: [string, typeof EntityClass]) => new EntityClass({ ...entity, id: key })
		);
	}

	const loadingPrivate = writable(false);
	const loading: Readable<boolean> = {
		subscribe: loadingPrivate.subscribe
	};

	const records = derived(
		[session, db],
		([{ user }, $db], setEntities) => {
			setEntities([]);

			const entitiesRef = entityAPI.entityRef('', user?.uid, $db);
			if (!entitiesRef) return;

			loadingPrivate.set(true);
			return onValue(entitiesRef, (snapshot) => {
				setEntities(convertToArray(snapshot.val()));
				loadingPrivate.set(false);
			});
		},
		[] as EntityClassType[]
	);

	return { records, loading };
}
