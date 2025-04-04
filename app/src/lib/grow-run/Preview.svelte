<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import type GrowRun from '$lib/grow-run';
	export let growRun: GrowRun;

	$: cost = growRun.calculateCost($resourcesList);
	$: costPer100g = growRun.calculateCostPer100g($resourcesList);
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr on:click on:keypress>
	<td>{growRun.name}</td>
	<td>{growRun.totalMassLeavesHarvested().toFixed(2)}</td>
	<td>${cost.toFixed(2)}</td>
	<td>{growRun.totalMassLeavesHarvested() != 0 ? '$' + costPer100g.toFixed(2) : 'No output 🥲'}</td>
</tr>
