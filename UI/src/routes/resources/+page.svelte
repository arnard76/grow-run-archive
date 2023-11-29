<script lang="ts">
	import { resourcesList } from '$lib/data/stores';
	import Resource from '$lib/components/Resource.svelte';
	import ResourceClass from '$lib/model/resource';
	import units from '$lib/data/units';

	let costInput: number,
		totalInput: number,
		typeInput: string,
		unitInput: string,
		nameInput: string;
</script>

{#each $resourcesList as resource (resource.name)}
	<Resource {resource} />
{/each}

It costs $<input type="number" bind:value={costInput} /> NZD<br />
for <input type="number" bind:value={totalInput} />
<select bind:value={typeInput}>
	{#each Object.keys(units) as type (type)}
		<option value={type}>{type}</option>
	{/each}
</select>
{#if typeInput && Object.keys(units).includes(typeInput)}
	<select bind:value={unitInput}>
		{#each units[typeInput] as unit}
			<option value={unit}>{unit}</option>
		{/each}
	</select>
{/if}<br />
of <input type="text" bind:value={nameInput} placeholder="resource name here..." /><br />

<button
	on:click={() => {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		resourcesList.addNewResource(
			new ResourceClass(nameInput, costInput, typeInput, unitInput, totalInput, randomColour, '')
		);
	}}>Add to list</button
>
