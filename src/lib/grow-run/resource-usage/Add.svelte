<script lang="ts">
	import { resourcesList, growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	import AddTemplate from '$lib/components/AddTemplate.svelte';

	export let growRun: GrowRun;

	let selectedResourceToUse: string;
	let amountUsedInput: number;
</script>

<AddTemplate
	onClick={() => {
		growRun.addResourceUsage({
			amountUsed: amountUsedInput,
			name: selectedResourceToUse
		});
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Used"
>
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
</AddTemplate>
