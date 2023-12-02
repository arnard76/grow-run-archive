import { get, writable, readable } from 'svelte/store';
import Resource from '$lib/resource/resource';
import GrowRun, { type GrowRunConstructorType } from '$lib/grow-run/growRun';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/database/firebase';

const db = getDatabase(app);

const noResourceFound = {
	name: 'RESOURCE NOT FOUND',
	cost: 100,
	amountType: 'mass',
	amountUnit: 'g',
	amountTotal: 100,
	colour: 'black',
	notes: ''
};

const resourcesListRef = ref(db, 'resource-list/');
export const resourcesList = {
	...readable([] as Resource[], (storeSet) => {
		return onValue(resourcesListRef, (snapshot) => {
			const data = snapshot.val();
			storeSet(resourcesList.convertToArray(data));
		});
	}),

	convertToArray(data?: Resource[]): Resource[] {
		return Object.entries(data || get(this)).map(
			([key, resource]: [string, Resource]) =>
				new Resource(
					resource.name,
					resource.cost,
					resource.amountType,
					resource.amountUnit,
					resource.amountTotal,
					resource.colour,
					resource.notes
				)
		);
	},

	addNewResource(resource: Resource) {
		const newResourceRef = push(resourcesListRef);
		set(newResourceRef, resource);
	},

	getResource(resourceName: string): Resource {
		const resource = resourcesList
			.convertToArray()
			.find((resource: any) => resource.name === resourceName);

		let { name, cost, notes, amountType, amountUnit, amountTotal, colour } =
			resource || noResourceFound;
		return new Resource(name, cost, amountType, amountUnit, amountTotal, colour, notes);
	}
};

const growRunsRef = ref(db, 'grow-runs/');
export const growRunsStore = {
	...readable([] as GrowRun[], (storeSet) => {
		return onValue(growRunsRef, (snapshot) => {
			const data = snapshot.val();
			const converted = growRunsStore.convertToArray(data);
			storeSet(converted);
		});
	}),

	convertToArray(growRunData: any[]): GrowRun[] {
		return Object.entries(growRunData).map(
			([key, growRun]: [string, GrowRun]) => new GrowRun({ ...growRun, id: key })
		);
	},

	updateGrowRun(growRun: GrowRun) {
		const growRunRef = ref(db, `grow-runs/${growRun.id}`);
		set(growRunRef, growRun);
	},

	addGrowRun({ name }: { name: GrowRun['name'] }) {
		const newGrowRunRef = push(growRunsRef);
		set(newGrowRunRef, { name });
	}
};
