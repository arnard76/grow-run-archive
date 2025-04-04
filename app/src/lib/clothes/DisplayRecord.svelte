<script lang="ts">
	import { standardiseColour } from '$lib/styles/utils';
	import type { ItemOfClothing } from './type';
	import { GetColorName as getColourName } from 'hex-color-to-color-name';

	export let record: ItemOfClothing;
	$: record.colour = standardiseColour(record.colour);
</script>

<p>{getColourName(record.colour).toLowerCase()} {record.name} {record.type}</p>
