<script lang="ts">
	import { growRunsStore } from '$lib/data/stores';

	import GrowRun from '$lib/components/GrowRun.svelte';
	import AddGrowRun from '$lib/components/AddGrowRun.svelte';
</script>

<h1>Grow Run Archive</h1>
<AddGrowRun />
<table class="grow-runs">
	<tr>
		<th>Name</th>
		<th>Experiment</th>
		<th>Output (g)</th>
		<th>Duration (days)</th>
		<th>Cost (NZD)</th>
		<th>Cost per 100g (NZD)</th>
	</tr>

	{#each $growRunsStore as growRun}
		<GrowRun {growRun} />
	{/each}
</table>

<style>
	tr {
		text-align: left;
	}
</style>
