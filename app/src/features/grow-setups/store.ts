import { EntityAPI } from '$lib/entity/api';
import { createEntityStores } from '$lib/entity/store';
import { GrowSetup, type GrowSetupType } from '@grow-run-archive/definitions';

export const growSetupsAPI = new EntityAPI<GrowSetupType>('grow-setups', 'id');
export const { loading: growSetupsLoading, records: growSetups } = createEntityStores(
	GrowSetup,
	growSetupsAPI
);
