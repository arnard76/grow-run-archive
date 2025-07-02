<script lang="ts">
	import {
		formatToLocalDate,
		formatToUTCISO
	} from '$features/grow-runs/grow-run/details/duration/util';
	import type { Harvest } from '@grow-run-archive/definitions';

	export let harvest: Harvest;

	// handling date stuff
	let harvestingRightNow = harvest.datetime == undefined;
	let localDateTime = formatToLocalDate(harvest.datetime);
	$: if (harvestingRightNow) localDateTime = formatToLocalDate(new Date(Date.now()).toISOString());
	$: if (localDateTime) harvest.datetime = formatToUTCISO(localDateTime) as string;
</script>

<div class="horizontal-input-group">
	Harvested
	<input type="number" bind:value={harvest.numberOfLeaves} />
	leaves weighing
	<input type="number" bind:value={harvest.massOfLeaves} />
	g

	<pre class={!harvestingRightNow ? 'line-through' : ''}>right now</pre>
	<input type="checkbox" bind:checked={harvestingRightNow} />

	{#if !harvestingRightNow}
		on <input type="datetime-local" bind:value={localDateTime} class="w-60" />
	{/if}
</div>

<style>
	input[type='number'] {
		width: 80px;
	}
</style>
