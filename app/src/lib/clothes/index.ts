import { Entity } from '$lib/abstract-entity/entity';
import { EntityNames } from '@grow-run-archive/definitions';
import Inputs from './Inputs.svelte';
import DisplayRecord from './DisplayRecord.svelte';
import type { ItemOfClothing } from './type';

const clothes = new Entity<ItemOfClothing>({
	names: new EntityNames('Item of clothing', 'clothes', 'Clothes'),
	idProperty: 'id',
	Inputs,
	DisplayRecord
});

export default clothes;
