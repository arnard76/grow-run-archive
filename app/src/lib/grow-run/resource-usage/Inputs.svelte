<script lang="ts">
	import { resourcesList } from '$lib/resource/store';

	export let selectedResourceToUse: string | undefined = undefined;
	export let amountUsedInput: number | undefined = undefined;
</script>

<div class="horizontal-input-group">
	<input type="number" bind:value={amountUsedInput} />
	{#if selectedResourceToUse === 'new'}
		<select>
			<option value="volume">volume</option>
			<option value="mass">mass</option>
			<option value="number">number</option>
		</select>
	{:else if selectedResourceToUse}
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
</div>
