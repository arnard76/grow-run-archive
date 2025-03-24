<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import type { ResourceUsage } from '@grow-run-archive/definitions';

	export let usageOfResource: ResourceUsage;
</script>

<div class="horizontal-input-group">
	<input type="number" bind:value={usageOfResource.amountUsed} />
	{#if usageOfResource.resourceName === 'new'}
		<select>
			<option value="volume">volume</option>
			<option value="mass">mass</option>
			<option value="number">number</option>
		</select>
	{:else if usageOfResource.resourceName}
		<span>{resourcesList.getResource(usageOfResource.resourceName)?.amountUnit}</span>
	{/if}

	of
	<select name="" id="" required bind:value={usageOfResource.resourceName}>
		{#each Object.entries($resourcesList) as [id, resource]}
			<option value={resource.name}>{resource.name}</option>
		{/each}
		<option value="new">(new resource)</option>
	</select>

	{#if usageOfResource.resourceName === 'new'}
		<input type="text" name="" id="" placeholder="name of new resource" />
	{/if}
</div>
