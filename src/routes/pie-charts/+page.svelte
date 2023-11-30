<script lang="ts">
	import { growRunsStore, resourcesList } from '$lib/grow-run/stores';
	import PieGraph from '$lib/grow-run/resource-usage/PieGraph.svelte';
</script>

<div>
	{#each $growRunsStore as growRun}
		{#if growRun.resources?.used?.length && $resourcesList}
			{@const pieChartData = $resourcesList && growRun.formatDataForPieChart()}

			<div style="display: flex; flex-direction: column; text-align:center;">
				<p>{growRun.name}</p>
				<PieGraph pie={pieChartData} sort="alphabet" />
			</div>
		{/if}
	{/each}
</div>

<style>
	div {
		display: flex;
	}
</style>
