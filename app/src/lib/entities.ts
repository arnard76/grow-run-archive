import clothes from '$lib/clothes';
import type { Entity } from './abstract-entity/entity';
import { growRunEntity } from './grow-run';
import videos from './videos';

export const entities: Entity<any>[] = [clothes, videos, growRunEntity];
