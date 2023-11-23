<script lang="ts">
	import { resourcesList, getResource, growRunsStore } from '$lib/data/stores';
	import type GrowRun from '$lib/model/growRun';
	import ResourceUsage from './ResourceUsage.svelte';

	export let growRun: GrowRun;

	let expanded = false;
	let selectedResourceToUse: string;
	let amountUsedInput: number;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr class="preview" on:click={() => (expanded = !expanded)} on:keypress>
	<td>{growRun.name}</td>
	<td><a href="/experiment/{growRun.fromExperiment}">{growRun.fromExperiment}</a></td>
	<td>how to calc output?</td>
	<td>${growRun.calculateCost().toFixed(2)}</td>
</tr>

<tr>
	<td colspan="10">
		{#if expanded}
			<h4>Resources Used</h4>

			<ul>
				{#each growRun.resources?.used || [] as { name, amountUsed }}
					{@const resource = getResource(name)}
					{#if resource}
						<ResourceUsage {resource} {amountUsed} />
					{/if}
				{/each}
			</ul>

			<label>
				<input type="number" bind:value={amountUsedInput} />
				{#if selectedResourceToUse === 'new'}
					<select>
						<option value="volume">volume</option>
						<option value="mass">mass</option>
						<option value="number">number</option>
					</select>
				{:else}
					<span>{getResource(selectedResourceToUse)?.amountUnit}</span>
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
					growRun.addResourceUsage({ amountUsed: amountUsedInput, name: selectedResourceToUse });
					growRunsStore.updateGrowRun(growRun);
				}}>Used</button
			>

			<h4>Output</h4>
			more data...
			<h4>Conditions</h4>
			more data...
		{/if}
	</td>
</tr>

<style>
	.preview {
		cursor: pointer;
		background-color: lightblue;
	}
</style>
