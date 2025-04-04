import { Entity } from '$lib/abstract-entity/entity';
import { EntityNames } from '@grow-run-archive/definitions';
import Inputs from './Inputs.svelte';

const videos = new Entity<Video>({
	idProperty: 'id',
	names: new EntityNames('Video'),
	Inputs
});

export default videos;
