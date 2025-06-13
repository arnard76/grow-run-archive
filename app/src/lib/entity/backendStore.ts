import { EntityAPIClient } from '$lib/entity/apiClient';
import { session } from '$lib/user/user';
import { derived, writable, type Readable } from 'svelte/store';
import { io } from 'socket.io-client';
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Creates two stores to use the entity records or check if its loading
 * @param EntityClass - the class to store the resources as
 * @param EntityAPIClient - the API to
 * @returns [entityRecords, entityRecordsLoading]
 */
export function createEntityStores<EntityClassType>(
	EntityClass: { new (arg?: any): EntityClassType },
	EntityAPIClient: EntityAPIClient<any>
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
		[session],
		([{ user }], setEntities) => {
			setEntities([]);

			const entitiesRef = EntityAPIClient.entityRef('', user?.uid);
			if (!entitiesRef) return;

			loadingPrivate.set(true);

			const socket = io('http://localhost:3003', { auth: { token: user?.uid } });

			socket.on('connect', () => {
				console.info(
					`User ${user?.uid} connected to websocket for realtime data changes to ${EntityAPIClient.entityName}`
				);
			});

			socket.on(`${EntityAPIClient.entityName}`, (data) => {
				setEntities(convertToArray(data));
				loadingPrivate.set(false);
			});

			return socket.disconnect;
		},
		[] as EntityClassType[]
	);

	return { records, loading };
}
