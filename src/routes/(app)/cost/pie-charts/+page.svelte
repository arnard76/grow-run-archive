<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import { growRunsStore } from '$lib/grow-run/store';
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
