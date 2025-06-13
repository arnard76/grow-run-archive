import { EntityAPIClient } from '$lib/entity/apiClient';
import { createEntityStores } from '$lib/entity/backendStore';
import GrowRun from '$features/grow-run';
import { type GrowRunType } from '@grow-run-archive/definitions';

export const growRunsAPI = new EntityAPIClient<GrowRunType>('grow-runs', 'id');
export const { loading: growRunsLoading, records: growRuns } = createEntityStores(
	GrowRun,
	growRunsAPI
);
