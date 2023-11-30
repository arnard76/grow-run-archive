<script lang="ts">
	import { growRunsStore } from '$lib/grow-run/stores';

	import GrowRun from '$lib/grow-run/ListItem.svelte';
	import AddGrowRun from '$lib/grow-run/Add.svelte';
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
