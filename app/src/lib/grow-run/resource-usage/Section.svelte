<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import type GrowRun from '$lib/grow-run';
	import ResourceUsage from './ListItem.svelte';
	import PieGraph from './PieGraph.svelte';
	import Add from './Add.svelte';

	export let growRun: GrowRun;

	$: pieChartData = $resourcesList && growRun.formatDataForPieChart();
</script>

<section>
	<h2>Resources Used</h2>

	{#if growRun.resources?.used?.length}
		<ul class="mb-4">
			{#each growRun.resources.used as usageOfResource}
				{@const resource = resourcesList.getResource(usageOfResource.resourceName)}
				{#if resource}
					<ResourceUsage {growRun} {usageOfResource} />
				{/if}
			{/each}
			<hr />
			<li class="font-bold list-none flex">
				<span class="inline-block w-[300px]">Total cost</span>
				<span>
					${growRun.calculateCost($resourcesList).toFixed(2)}
				</span>
			</li>
		</ul>
	{:else}
		<p class="inline">No usage of resources recorded:</p>
	{/if}
	<Add {growRun} />
	{#if growRun.resources?.used?.length}
		<div class="mt-16">
			<PieGraph pie={pieChartData} sort="alphabet" />
		</div>
	{/if}
</section>
