import { derived, get } from 'svelte/store';
import GrowRun from '$lib/grow-run';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { app } from '$lib/database/firebase';
import { session } from '$lib/firebase/user';

const db = getDatabase(app);
export const growRunsStore = {
	...derived(
		session,
		({ user }, storeSet) => {
			storeSet([]);

			if (!user?.uid) return;

			const growRunsRef = ref(db, `${user.uid}/grow-runs/`);

			return onValue(growRunsRef, (snapshot) => {
				const data = snapshot.val();
				const converted = growRunsStore.convertToArray(data);
				storeSet(converted);
			});
		},
		[] as GrowRun[]
	),

	convertToArray(growRunData: any[]): GrowRun[] {
		return Object.entries(growRunData || {}).map(
			([key, growRun]: [string, GrowRun]) => new GrowRun({ ...growRun, id: key })
		);
	},

	updateGrowRun(growRun: GrowRun) {
		const userId = get(session)?.user?.uid;
		if (!userId) return;

		const growRunRef = ref(db, `${userId}/grow-runs/${growRun.id}`);
		set(growRunRef, growRun);
	},

	addGrowRun({ name }: { name: GrowRun['name'] }) {
		const userId = get(session)?.user?.uid;
		if (!userId) return;

		const growRunsRef = ref(db, `${userId}/grow-runs/`);

		const newGrowRunRef = push(growRunsRef);
		set(newGrowRunRef, { name });
	}
};
