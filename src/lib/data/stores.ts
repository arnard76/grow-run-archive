import { get, writable } from 'svelte/store';
import Resource from '$lib/model/resource';
import GrowRun from '$lib/model/growRun';

export const growRunsStore = writable([] as GrowRun[]);
export const resourcesList = writable([] as Resource[]);

function convertGrowRunsData(growRunData: any[]): GrowRun[] {
	function getResourceFromResourceList(resourceName: string): Resource | undefined {
		const resource = get(resourcesList).find((resource: any) => resource.name === resourceName);
		if (!resource) return;
		let { name, cost, notes, amountType, amountUnit, amountTotal } = resource;
		return new Resource(name, cost, amountType, amountUnit, amountTotal, notes);
	}

	return growRunData.map(
		(growRun: any) =>
			new GrowRun(growRun.name, growRun.fromExperiment, {
				used:
					growRun.resources?.used?.map((resource: any) => ({
						...resource,
						resource: getResourceFromResourceList(resource.name)
					})) || []
			})
	);
}

import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '$lib/data/firebase';

const db = getDatabase(app);

const resourcesListRef = ref(db, 'resource-list/');
onValue(resourcesListRef, (snapshot) => {
	const data = snapshot.val();
	resourcesList.set(data);
});

const growRunsRef = ref(db, 'grow-runs/');
onValue(growRunsRef, (snapshot) => {
	const data = snapshot.val();
	growRunsStore.set(convertGrowRunsData(data));
});
