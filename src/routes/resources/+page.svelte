<script lang="ts">
	import { resourcesList } from '$lib/resource/store';
	import Resource from '$lib/resource/ListItem.svelte';
	import type ResourceClass from '$lib/resource/';
	import Inputs from '$lib/resource/Inputs.svelte';
	import AddTemplate from '$lib/components/AddTemplate.svelte';

	let newResource = {} as ResourceClass;
</script>

{#each $resourcesList as resource (resource.name)}
	<Resource {resource} />
{/each}

<AddTemplate
	addText="Add to list"
	onClick={() => {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		newResource.colour = randomColour;
		resourcesList.addNewResource(newResource);
	}}
>
	<Inputs bind:resourceToCreateOrUpdate={newResource} />
</AddTemplate>
