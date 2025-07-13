<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import type GrowRun from '$features/grow-runs/grow-run';
	import Icon from '@iconify/svelte';
	import { growSetups } from '$features/grow-setups/store';
	export let growRun: GrowRun;

	$: cost = growRun.calculateCost($resourcesList);
	$: costPer100g = growRun.calculateCostPer100g($resourcesList);
	$: growRunGrowSetup = growRun.growSetup && $growSetups.find((gs) => gs.id === growRun.growSetup);
</script>

<tr>
	<td>
		<a href="/grow-runs/{growRun.id}" style="width: 100%">
			{#if growRunGrowSetup}
				<p class="inline-flex">({growRunGrowSetup.shortName})</p>
			{/if}
			{#if growRun.location?.address.city}
				<p class="inline-flex">
					(<Icon icon="tabler:map-pin" class="mr-1" />{growRun.location.address.city})
				</p>
			{/if}
			{growRun.name}
		</a>
	</td>
	<td>{growRun.totalMassLeavesHarvested.toFixed(2)}</td>
	<td>${cost.toFixed(2)}</td>
	<td>
		{#if isNaN(costPer100g)}
			{#if growRun.totalMassLeavesHarvested === 0}
				No output 🥲
			{:else}
				Can't calculate
			{/if}
		{:else}
			${costPer100g.toFixed(2)}
		{/if}
	</td>
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
