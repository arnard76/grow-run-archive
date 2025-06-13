import { EntityFirebaseRouter } from '@/entity/api.js';
import { ResourceType } from '@grow-run-archive/definitions';

export default new EntityFirebaseRouter<ResourceType>('resource-list', 'id').exportRouter();
