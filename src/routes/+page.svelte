<script lang="ts">
	import { growRunsStore } from '$lib/data/stores';

	import GrowRun from '$lib/components/GrowRun.svelte';
</script>

<h1>Grow Run Archive</h1>

<table class="grow-runs">
	<tr>
		<th>Name</th>
		<th>Experiment</th>
		<th>Output (g)</th>
		<th>Cost (NZD)</th>
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
