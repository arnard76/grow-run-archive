import { Entity } from '$lib/abstract-entity/entity';
import { EntityNames } from '@grow-run-archive/definitions';
import Inputs from './Inputs.svelte';
import DisplayRecord from './DisplayRecord.svelte';

const videos = new Entity<Video>({
	idProperty: 'id',
	names: new EntityNames({ name: 'Video' }),
	Inputs,
	DisplayRecord
});

export default videos;
