<script lang="ts">
	import { growRuns } from '$lib/grow-run/store';

	import GrowRun from '$lib/grow-run/ListItem.svelte';
	import AddGrowRun from '$lib/grow-run/Add.svelte';
</script>

<h1>Grow Runs</h1>
<AddGrowRun />
<table class="grow-runs">
	<tr>
		<th>Name</th>
		<th>Output (g)</th>
		<th>Cost (NZD)</th>
		<th>Cost per 100g (NZD)</th>
	</tr>

	{#each $growRuns as growRun}
		<GrowRun {growRun} />
	{/each}
</table>

<style>
	table {
		width: 95vw;
	}

	tr {
		text-align: left;
	}
	th {
		padding: 15px;
	}
</style>