import { EntityAPI } from '$lib/abstract-entity/api';
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
export function createEntityStores(EntityClass: any, entityAPI: EntityAPI<any>) {
	function convertToArray(entitiesData: { [key: string]: any }): (typeof EntityClass)[] {
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
		[] as (typeof EntityClass)[]
	);

	return { records, loading };
}

/**
 * Creates store to use the entity records
 * Includes another store to check if its loading
 */
export class EntityStore<EntityType> {
	entityAPI: EntityAPI<EntityType>;
	EntityClass?: any;

	constructor(entityAPI: EntityAPI<EntityType>, EntityClass?: any) {
		this.entityAPI = entityAPI;
		this.EntityClass = EntityClass;
	}

	convertToArray(entitiesData: { [key: string]: any }): EntityType[] {
		if (!entitiesData) return [];
		return Object.entries(entitiesData || {}).map(([key, entity]: [string, EntityType]) => {
			const transformedObject = { ...entity, id: key };
			console.log(this.EntityClass);
			return this.EntityClass ? new this.EntityClass(transformedObject) : transformedObject;
		});
	}

	private loadingPrivate = writable(false);
	loading: Readable<boolean> = {
		subscribe: this.loadingPrivate.subscribe
	};

	records = derived(
		[session, db],
		([{ user }, $db], setEntities) => {
			setEntities([]);

			const entitiesRef = this.entityAPI.entityRef('', user?.uid, $db);
			if (!entitiesRef) return;

			this.loadingPrivate.set(true);
			return onValue(entitiesRef, (snapshot) => {
				setEntities(this.convertToArray(snapshot.val()));
				this.loadingPrivate.set(false);
			});
		},
		[] as EntityType[]
	);
}
