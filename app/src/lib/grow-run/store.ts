import { EntityAPI } from '$lib/abstract-entity/api';
import { createEntityStores } from '$lib/abstract-entity/store';
import GrowRun from '$lib/grow-run';

export const growRunsAPI = new EntityAPI<GrowRun>('grow-runs', 'id');
export const { loading: growRunsLoading, records: growRuns } = createEntityStores(
	GrowRun,
	growRunsAPI
);
