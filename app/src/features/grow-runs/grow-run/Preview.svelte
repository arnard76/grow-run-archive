<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import type GrowRun from '$features/grow-runs/grow-run';
	export let growRun: GrowRun;

	$: cost = growRun.calculateCost($resourcesList);
	$: costPer100g = growRun.calculateCostPer100g($resourcesList);
</script>

<tr>
	<td>
		<a href="/grow-runs/{growRun.id}" style="width: 100%">
			{growRun.location?.address.city ? `(${growRun.location?.address.city})` : ''}
			{growRun.name}
		</a>
	</td>
	<td>{growRun.totalMassLeavesHarvested().toFixed(2)}</td>
	<td>${cost.toFixed(2)}</td>
	<td>{growRun.totalMassLeavesHarvested() != 0 ? '$' + costPer100g.toFixed(2) : 'No output 🥲'}</td>
</tr>

<style>
	a {
		display: block;
		height: 100%;
		padding: 15px;
	}

	td:first-of-type {
		border: 1px solid transparent;
		border-radius: 10px;
		padding: 0;
	}

	td:nth-of-type(2) {
		border: 1px solid transparent;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	td:last-of-type {
		border: 1px solid transparent;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}
</style>
