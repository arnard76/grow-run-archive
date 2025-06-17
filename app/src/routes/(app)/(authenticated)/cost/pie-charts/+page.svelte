<script lang="ts">
	import { resourcesList } from '$features/resource/store';
	import { growRuns } from '$features/grow-run/store';
	import PieGraph from '$features/grow-run/resource-usages/PieGraph.svelte';
</script>

<main class="p-2">
	<h1>Compare cost breakdown of all grow runs</h1>
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
</main>

<style>
	div {
		display: flex;
	}
</style>
