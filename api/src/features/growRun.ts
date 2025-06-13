import { EntityFirebaseRouter } from '@/entity/api.js';
import { GrowRunType } from '@grow-run-archive/definitions';

export default new EntityFirebaseRouter<GrowRunType>('grow-runs', 'id').exportRouter();
