import { get, writable } from 'svelte/store';
import Resource from '$lib/model/resource';
import GrowRun, { type GrowRunType } from '$lib/model/growRun';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/data/firebase';

const db = getDatabase(app);

type ResourceList = { [key: string]: Resource };

const resourcesListRef = ref(db, 'resource-list/');
export const resourcesList = {
	...writable({} as ResourceList, () => {
		return onValue(resourcesListRef, (snapshot) => {
			const data = snapshot.val();
			resourcesList.set(data);
			growRunsStore.set(get(growRunsStore));
		});
	}),
	convertToArray(data?: ResourceList) {
		return Object.values(data || get(this));
	},
	addNewResource(resource: Resource) {
		const newResourceRef = push(resourcesListRef);
		set(newResourceRef, resource);
	}
};

const growRunsRef = ref(db, 'grow-runs/');
export const growRunsStore = {
	...writable([] as GrowRun[], () => {
		return onValue(growRunsRef, (snapshot) => {
			const data = snapshot.val();
			const converted = convertGrowRunsData(data);
			growRunsStore.set(converted);
		});
	}),

	updateGrowRun(growRun: GrowRun) {
		const growRunRef = ref(db, `grow-runs/${growRun.id}`);
		set(growRunRef, growRun);
	}
};

export function getResource(resourceName: string): Resource | undefined {
	const resource = resourcesList
		.convertToArray()
		.find((resource: any) => resource.name === resourceName);
	if (!resource) return;
	let { name, cost, notes, amountType, amountUnit, amountTotal } = resource;
	return new Resource(name, cost, amountType, amountUnit, amountTotal, notes);
}

function convertGrowRunsData(growRunData: any[]): GrowRun[] {
	return Object.entries(growRunData).map(
		([key, growRun]: [string, GrowRunType]) => new GrowRun({ ...growRun, id: key })
	);
}
