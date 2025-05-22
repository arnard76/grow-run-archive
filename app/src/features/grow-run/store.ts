import { EntityAPI } from '$lib/entity/api';
import { createEntityStores } from '$lib/entity/store';
import GrowRun from '$features/grow-run';

export const growRunsAPI = new EntityAPI<GrowRun>('grow-runs', 'id');
export const { loading: growRunsLoading, records: growRuns } = createEntityStores(
	GrowRun,
	growRunsAPI
);
