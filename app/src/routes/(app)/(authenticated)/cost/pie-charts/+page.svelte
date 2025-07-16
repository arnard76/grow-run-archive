<script lang="ts">
	import { growRuns } from '$features/grow-runs/grow-run/store';
	import ResourceUsagePieGraph from '$features/grow-runs/grow-run/resource-usages/ResourceUsagePieGraph.svelte';
</script>

<main>
	<h1>Compare cost breakdown of all grow runs</h1>
	<div class="flex">
		{#each $growRuns as growRun}
			{#if growRun.resources?.used?.length}
				<div class="flex flex-col text-center">
					<p>{growRun.name}</p>
					<ResourceUsagePieGraph {growRun} />
				</div>
			{/if}
		{/each}
	</div>
</main>
