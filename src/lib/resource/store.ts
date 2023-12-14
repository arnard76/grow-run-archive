import { get, readable } from 'svelte/store';
import Resource from '$lib/resource';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/database/firebase';

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

const resourcesListRef = ref(db, 'resource-list/');
export const resourcesList = {
	...readable([] as Resource[], (storeSet) => {
		return onValue(resourcesListRef, (snapshot) => {
			const data = snapshot.val();
			storeSet(resourcesList.convertDbObjToArray(data));
		});
	}),

	updateResourcesListOnDb(resources?: Resource[]) {
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
