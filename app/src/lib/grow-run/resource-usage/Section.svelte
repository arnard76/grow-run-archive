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
		<ul class="mb-16">
			{#each growRun.resources.used as { resourceName, amountUsed }}
				{@const resource = resourcesList.getResource(resourceName)}
				{#if resource}
					<ResourceUsage {growRun} {resourceName} {amountUsed} />
				{/if}
			{/each}
			<Add {growRun} />
			<hr />
			<li class="font-bold list-none flex">
				<span class="inline-block w-[300px]">Total cost</span>
				${growRun.calculateCost($resourcesList).toFixed(2)}
			</li>
		</ul>
	{:else}
		<p>Currently, no resources have been used AND the usage recorded. Feel free to add below:</p>
		<Add {growRun} />
	{/if}
	{#if growRun.resources?.used?.length}
		<PieGraph pie={pieChartData} sort="alphabet" />
	{/if}
</section>
