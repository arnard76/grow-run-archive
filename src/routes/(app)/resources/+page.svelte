<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import Resource from '$lib/resource/ListItem.svelte';
	import type ResourceClass from '$lib/resource/';
	import Inputs from '$lib/resource/Inputs.svelte';
	import AddTemplate from '$lib/components/AddTemplate.svelte';

	let newResource = {} as ResourceClass;
</script>

<table>
	<tr>
		<th>Name</th>
		<th>Cost</th>
		<th>Amount</th>
	</tr>
	{#each structuredClone($resourcesList) as resource (resource.name)}
		<Resource {resource} />
	{/each}
</table>

<AddTemplate
	addText="Add to list"
	onClick={() => {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		newResource.colour = randomColour;
		resourcesList.addResource(newResource);
	}}
>
	<Inputs bind:resourceToCreateOrUpdate={newResource} />
</AddTemplate>

<style>
	table {
		width: 95vw;
	}

	tr {
		text-align: left;
	}
	th {
		padding: 15px;
	}
</style>
