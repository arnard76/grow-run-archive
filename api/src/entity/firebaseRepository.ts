import { database } from '@/services/database/firebase/index.js';

export class EntityFirebaseRepository<Entity> {
	entityIdProperty: keyof Entity;
	entityName: string;

	constructor(entityName: string, entityIdProperty: keyof Entity) {
		this.entityName = entityName;
		this.entityIdProperty = entityIdProperty;
	}

	/**
	 * @param path - if provided, it should start with a /
	 */
	entityRef(userId: string, path = '') {
		return database.ref(`${userId}/${this.entityName}${path}`);
	}

	// validation built-in to firebase security rules??
	// get validators() {
	// 	return {
	// 		create: createInsertSchema(this.table),
	// 		get: createSelectSchema(this.table),
	// 		edit: createUpdateSchema(this.table),
	// 		replace: createInsertSchema(this.table)
	// 	};
	// }

	async replace(userId: string, entity: Entity) {
		const entityRef = this.entityRef(userId, `/${entity[this.entityIdProperty]}`);
		entityRef.set(entity);
	}

	async edit(userId: string, entityId: string, updates: Partial<Entity>) {
		const entityRef = this.entityRef(userId, `/${entityId}`);
		entityRef.update(updates);
	}

	add = async (userId: string, entityAdd: Partial<Entity>) => {
		console.log('in firebase repository 1');
		const recordsRef = this.entityRef(userId);
		console.log('in firebase repository 2');
		await recordsRef.push(entityAdd, (a) => {
			console.error(a?.message);
		});
		console.log('in firebase repository 2', { entityAdd });
	};

	async delete(userId: string, entityId: string) {
		this.entityRef(userId, `/${entityId}`).remove();
	}
}
