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

	<div class="flex">
		<div class="max-w-[50%]">
			{#if growRun.resources?.used?.length}
				<ul>
					{#each growRun.resources.used as { name, amountUsed }}
						{@const resource = resourcesList.getResource(name)}
						{#if resource}
							<ResourceUsage {growRun} resourceName={name} {amountUsed} />
						{/if}
					{/each}
					<hr />
					<li class="font-bold">
						<span class="inline-block w-[300px]">Total cost</span>
						${growRun.calculateCost($resourcesList).toFixed(2)} NZD
					</li>
				</ul>
			{:else}
				<p>
					Currently, no resources have been used AND the usage recorded. Feel free to add below:
				</p>
			{/if}
			<Add {growRun} />
		</div>
		{#if growRun.resources?.used?.length}
			<div class="flex-1">
				{#if growRun.resources?.used?.length}
					<PieGraph pie={pieChartData} sort="alphabet" />
				{/if}
			</div>
		{/if}
	</div>
</section>
