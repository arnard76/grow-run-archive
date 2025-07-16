<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import type GrowRun from '$features/grow-runs/grow-run';
	import ResourceUsage from './resource-usage/View.svelte';
	import ResourceUsagePieGraph from './ResourceUsagePieGraph.svelte';

	export let growRun: GrowRun;
</script>

<section>
	<h2>Resources Used</h2>

	{#if growRun.resources?.used?.length}
		<ul class="mb-4">
			{#each growRun.resources.used as usageOfResource}
				{@const resource = resourcesList.getResource(usageOfResource.resourceName)}
				{#if resource}
					<ResourceUsage {usageOfResource} />
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
		<p>No resources used</p>
	{/if}

	{#if growRun.resources?.used?.length}
		<div class="mt-16">
			<ResourceUsagePieGraph {growRun} />
		</div>
	{/if}
</section>
