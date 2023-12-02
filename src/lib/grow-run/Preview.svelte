<script lang="ts">
	import { resourcesList } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	export let growRun: GrowRun;

	$: cost = growRun.calculateCost($resourcesList);
	$: costPer100g = growRun.calculateCostPer100g($resourcesList);
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr on:click on:keypress>
	<td>{growRun.name}</td>
	<td>{growRun.totalMassLeavesHarvested()}</td>
	<td>${cost.toFixed(2)}</td>
	<td>{growRun.totalMassLeavesHarvested() != 0 ? '$' + costPer100g.toFixed(2) : 'No output 🥲'}</td>
</tr>

<style>
	tr {
		cursor: pointer;
		background-color: lightblue;
	}

	td {
		padding: 5px 15px;
	}
</style>
