import { db } from '$lib/database';
import { session } from '$features/user/session';
import * as firebase from 'firebase/database';
import { get } from 'svelte/store';

/**
 * This API can be used to interact with an entity which is stored within an Array on the firebase database
 */
export class EntityAPI<Entity> {
	entityIdProperty: keyof Entity;
	entityName: string;

	constructor(entityName: string, entityIdProperty: keyof Entity) {
		this.entityName = entityName;
		this.entityIdProperty = entityIdProperty;
	}

	/**
	 * @param path - if provided, it should start with a /
	 */
	entityRef(path = '', userId = get(session)?.user?.uid, database = get(db)) {
		if (!userId || !database) return;

		return firebase.ref(database, `${userId}/${this.entityName}${path}`);
	}

	updateFull(entity: Entity) {
		const entityRef = this.entityRef(`/${entity[this.entityIdProperty]}`);
		entityRef && firebase.set(entityRef, entity);
	}

	updatePartial(entityId: string, entityUpdates: Partial<Entity>) {
		const entityRef = this.entityRef(`/${entityId}`);
		entityRef && firebase.update(entityRef, entityUpdates);
	}

	add(entityAdd: Partial<Entity>) {
		const recordsRef = this.entityRef();
		if (!recordsRef) return;

		const newRecordRef = firebase.push(recordsRef);
		firebase.set(newRecordRef, entityAdd);
	}

	delete(id: string) {
		const deleteRef = this.entityRef(`/${id}`);
		deleteRef && firebase.remove(deleteRef);
	}
}
