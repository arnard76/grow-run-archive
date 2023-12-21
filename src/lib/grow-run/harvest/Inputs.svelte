<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$lib/grow-run/details/duration/util';
	import type { Harvest } from './types';

	export let harvest: Harvest;

	// handling date stuff
	let harvestingRightNow = harvest.datetime == undefined;
	let localDateTime = formatToLocalDate(harvest.datetime);
	$: if (harvestingRightNow) localDateTime = formatToLocalDate(new Date(Date.now()).toISOString());
	$: harvest.datetime = formatToUTCISO(localDateTime) as string;
</script>

<label>
	I harvested <input type="number" bind:value={harvest.numberOfLeaves} /> leaves
</label>

<label>
	that weighed

	<input type="number" bind:value={harvest.massOfLeaves} /> g
</label>

<label>
	right now <input type="checkbox" bind:checked={harvestingRightNow} />?
</label>

{#if !harvestingRightNow}
	<input type="datetime-local" bind:value={localDateTime} />
{/if}

<style>
	input {
		width: 50px;
	}
</style>
