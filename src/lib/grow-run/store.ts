import { readable } from 'svelte/store';
import GrowRun from '$lib/grow-run';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/database/firebase';

const db = getDatabase(app);
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
