<script lang="ts">
	import { standardiseColour } from '$lib/styles/utils';
	import type { ItemOfClothing } from './type';

	export let record: ItemOfClothing;
	$: record.colour = standardiseColour(record.colour);
</script>

<div class="horizontal-input-group">
	<input type="color" bind:value={record.colour} />
	<input type="text" bind:value={record.name} />
	<select bind:value={record.type}>
		<option value="t-shirt">t-shirt</option>
		<option value="jeans">jeans</option>
		<option value="shorts">shorts</option>
		<option value="hat">hat</option>
		<option value="socks">socks</option>
		<option value="jacket">jacket</option>
	</select>
</div>
