<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import { growRuns } from '$features/grow-runs/grow-run/store';
	import PieGraph from '$features/grow-runs/grow-run/resource-usages/PieGraph.svelte';
</script>

<main>
	<h1>Compare cost breakdown of all grow runs</h1>
	<div class="flex">
		{#each $growRuns as growRun}
			{#if growRun.resources?.used?.length && $resourcesList}
				{@const pieChartData = $resourcesList && growRun.formatDataForPieChart()}

				<div class="flex flex-col text-center">
					<p>{growRun.name}</p>
					<PieGraph pie={pieChartData} sort="alphabet" />
				</div>
			{/if}
		{/each}
	</div>
</main>
