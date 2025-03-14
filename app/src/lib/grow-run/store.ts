import { EntityAPI } from '$lib/api';
import { createDerivedStoreForEntity } from '$lib/entityStore';
import GrowRun from '$lib/grow-run';

class GrowRunsAPI extends EntityAPI<GrowRun> {
	entityName = 'grow-runs';
	entityIdProperty: 'id' = 'id';
}

export const growRunsAPI = new GrowRunsAPI();

export const growRuns = createDerivedStoreForEntity(GrowRun, growRunsAPI);
