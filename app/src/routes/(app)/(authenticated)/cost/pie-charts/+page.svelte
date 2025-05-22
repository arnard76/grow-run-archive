<script lang="ts">
	import { resourcesList } from '$features/resource/store';
	import { growRuns } from '$features/grow-run/store';
	import PieGraph from '$features/grow-run/resource-usage/PieGraph.svelte';
</script>

<div>
	{#each $growRuns as growRun}
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
