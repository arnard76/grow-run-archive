<script lang="ts">
	import { resourcesList } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	export let growRun: GrowRun;

	$: cost = $resourcesList && growRun.calculateCost();
	$: costPer100g = ((cost * 100) / growRun.totalMassLeavesHarvested()).toFixed(2);
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr on:click on:keypress>
	<td>{growRun.name}</td>
	<td>{growRun.totalMassLeavesHarvested()}</td>
	<td>{growRun.calculateDurationInDays() || '-'}</td>
	<td>${cost.toFixed(2)}</td>
	<td>${costPer100g}</td>
</tr>

<style>
	tr {
		cursor: pointer;
		background-color: lightblue;
	}
</style>
