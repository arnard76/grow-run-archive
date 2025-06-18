import { EntityAPI } from '$lib/entity/api';
import { createEntityStores } from '$lib/entity/store';
import GrowRun from '$features/grow-runs/grow-run';
import { type GrowRunType } from '@grow-run-archive/definitions';

export const growRunsAPI = new EntityAPI<GrowRunType>('grow-runs', 'id');
export const { loading: growRunsLoading, records: growRuns } = createEntityStores(
	GrowRun,
	growRunsAPI
);
