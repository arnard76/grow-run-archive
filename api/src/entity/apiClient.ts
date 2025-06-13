import { PUBLIC_API_URL } from '$env/static/public';
import { session } from '$lib/user/user';
import { get } from 'svelte/store';

/**
 * This API can be used to interact with an entity by requesting the backend API
 */
export class EntityAPIClient<Entity> {
	entityIdProperty: keyof Entity;
	entityName: string;

	constructor(entityName: string, entityIdProperty: keyof Entity) {
		this.entityName = entityName;
		this.entityIdProperty = entityIdProperty;
	}

	/**
	 * @param path - if provided, it should start with a /
	 */
	entityRef(path = '', userId = get(session)?.user?.uid) {
		if (!userId) return;

		return `${PUBLIC_API_URL}/${this.entityName}${path}`;
	}

	updateFull(entity: Entity) {
		const entityRef = this.entityRef(`/${entity[this.entityIdProperty]}`);
		entityRef && fetch(entityRef, { method: 'PUT', body: JSON.stringify(entity) });
	}

	updatePartial(entityId: string, entityUpdates: Partial<Entity>) {
		const entityRef = this.entityRef(`/${entityId}`);
		entityRef && fetch(entityRef, { method: 'PATCH', body: JSON.stringify(entityUpdates) });
	}

	add(entityAdd: Partial<Entity>) {
		const recordsRef = this.entityRef();
		recordsRef && fetch(recordsRef, { method: 'POST', body: JSON.stringify(entityAdd) });
	}

	delete(id: string) {
		const deleteRef = this.entityRef(`/${id}`);
		deleteRef && fetch(deleteRef, { method: 'DELETE' });
	}
}
