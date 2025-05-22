<script lang="ts">
	import { resourcesList } from '$features/resource/store';
	import Resource from '$features/resource/ListItem.svelte';
	import type ResourceClass from '$features/resource/';
	import Inputs from '$features/resource/Inputs.svelte';
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';

	let newResource = {} as ResourceClass;

	function addResource() {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		newResource.colour = randomColour;
		resourcesList.addResource(newResource);
		newResource = {} as ResourceClass;
	}
</script>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Cost (NZD)</th>
			<th>Amount</th>
		</tr>
	</thead>
	<tbody>
		{#each structuredClone($resourcesList) as resource (resource.id)}
			<Resource {resource} />
		{/each}
	</tbody>
</table>

<AddTemplate addText={resourceActionNames.add} onAdd={addResource}>
	<p>Here is an example:</p>
	<q>Volume: 10mL of nutrients for $10NZD</q>
	<Inputs bind:resourceToCreateOrUpdate={newResource} />
</AddTemplate>
