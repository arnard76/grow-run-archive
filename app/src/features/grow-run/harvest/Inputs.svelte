<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$features/grow-run/details/duration/util';
	import type { Harvest } from '@grow-run-archive/definitions';

	export let harvest: Harvest;

	// handling date stuff
	let harvestingRightNow = harvest.datetime == undefined;
	let localDateTime = formatToLocalDate(harvest.datetime);
	$: if (harvestingRightNow) localDateTime = formatToLocalDate(new Date(Date.now()).toISOString());
	$: if (localDateTime) harvest.datetime = formatToUTCISO(localDateTime) as string;
</script>

<div class="horizontal-input-group">
	<pre>I harvested</pre>
	<input type="number" bind:value={harvest.numberOfLeaves} /> leaves

	<pre>that weighed</pre>
	<input type="number" bind:value={harvest.massOfLeaves} /> g

	<pre>right now</pre>
	<input type="checkbox" bind:checked={harvestingRightNow} />?

	{#if !harvestingRightNow}
		<input type="datetime-local" bind:value={localDateTime} />
	{/if}
</div>

<style>
	input {
		width: 50px;
	}
</style>
