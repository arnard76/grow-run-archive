import { derived, get } from 'svelte/store';
import Resource from '$lib/resource';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/database/firebase';
import { session } from '$lib/firebase/user';

const db = getDatabase(app);

const noResourceFound = {
	id: 'noid',
	name: 'RESOURCE NOT FOUND',
	productLink: '#noproductlink',
	cost: 100,
	amountType: 'mass',
	amountUnit: 'g',
	amountTotal: 100,
	colour: 'black',
	notes: ''
};

type databaseResourceListObject = {
	[key: string]: any;
};

export const resourcesList = {
	...derived(
		session,
		({ user }, storeSet) => {
			if (!user?.uid) return storeSet([]);
			const resourcesListRef = ref(db, `${user.uid}/resource-list/`);

			return onValue(resourcesListRef, (snapshot) => {
				const data = snapshot.val();
				storeSet(resourcesList.convertDbObjToArray(data));
			});
		},
		[] as Resource[]
	),

	updateResourcesListOnDb(resources?: Resource[]) {
		const { user } = get(session);
		if (!user?.uid) return;

		const resourcesListRef = ref(db, `${user.uid}/resource-list/`);

		set(resourcesListRef, this.convertArrayToDbObj(resources));
	},

	convertDbObjToArray(data: databaseResourceListObject): Resource[] {
		return Object.entries(data).map(
			([id, resource]: [string, any]) => new Resource({ id, ...resource })
		);
	},

	convertArrayToDbObj(resources?: Resource[]): databaseResourceListObject {
		const dbObject: databaseResourceListObject = {};
		for (let resource of resources || get(this)) {
			dbObject[resource.id] = { ...resource, id: undefined };
			delete dbObject[resource.id].id;
		}
		return dbObject;
	},

	addNewResource(resource: Resource) {
		const { user } = get(session);
		if (!user?.uid) return;

		const resourcesListRef = ref(db, `${user.uid}/resource-list/`);

		const newResourceRef = push(resourcesListRef);
		set(newResourceRef, resource);
	},

	// local array is always up to date with db so can get directly from here
	getResource(resourceName: string, resources?: Resource[]): Resource {
		const resource = (resources || get(this)).find(
			(resource: any) => resource.name === resourceName
		);

		return new Resource(resource || noResourceFound);
	},

	editResource(resourceToEdit: Resource) {
		const resources = get(this);
		const index = resources.findIndex((resource) => resource.id === resourceToEdit.id);
		resources[index] = resourceToEdit;
		this.updateResourcesListOnDb(resources);
	},

	removeResource(resourceToDelete: Resource) {
		const resources = get(this);
		const index = resources.findIndex((resource) => resource.id === resourceToDelete.id);
		resources.splice(index, 1);
		this.updateResourcesListOnDb(resources);
	}
};
