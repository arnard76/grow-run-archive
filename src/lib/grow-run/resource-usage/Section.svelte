<script lang="ts">
	import { resourcesList, growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	import ResourceUsage from './ListItem.svelte';
	import PieGraph from './PieGraph.svelte';

	export let growRun: GrowRun;

	let selectedResourceToUse: string;

	let amountUsedInput: number;

	$: pieChartData = $resourcesList && growRun.formatDataForPieChart();
</script>

<h4>Resources Used</h4>

<div class="resources-container">
	<section>
		{#if growRun.resources?.used?.length}
			<ul>
				{#each growRun.resources.used as { name, amountUsed }}
					{@const resource = resourcesList.getResource(name)}
					{#if resource}
						<ResourceUsage {resource} {amountUsed} />
					{/if}
				{/each}
			</ul>
		{:else}
			<p>
				Currently no resources have been used OR they usage has not been recorded. Try adding them
				below:
			</p>
		{/if}

		<label>
			<input type="number" bind:value={amountUsedInput} />
			{#if selectedResourceToUse === 'new'}
				<select>
					<option value="volume">volume</option>
					<option value="mass">mass</option>
					<option value="number">number</option>
				</select>
			{:else}
				<span>{resourcesList.getResource(selectedResourceToUse)?.amountUnit}</span>
			{/if}

			of
			<select name="" id="" required bind:value={selectedResourceToUse}>
				{#each Object.entries($resourcesList) as [id, resource]}
					<option value={resource.name}>{resource.name}</option>
				{/each}
				<option value="new">(new resource)</option>
			</select>

			{#if selectedResourceToUse === 'new'}
				<input type="text" name="" id="" placeholder="name of new resource" />
			{/if}
		</label>
		<button
			on:click={() => {
				growRun.addResourceUsage({
					amountUsed: amountUsedInput,
					name: selectedResourceToUse
				});
				growRunsStore.updateGrowRun(growRun);
			}}>Used</button
		>
	</section>
	<section>
		{#if growRun.resources?.used?.length}
			<PieGraph pie={pieChartData} sort="alphabet" />
		{/if}
	</section>
</div>

<style>
	.resources-container {
		display: flex;
	}
</style>
