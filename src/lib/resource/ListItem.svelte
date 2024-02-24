<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { resourcesList } from '$lib/resource/store';
	import type Resource from '$lib/resource';
	import Inputs from './Inputs.svelte';
	export let resource: Resource;

	let editedResource: Resource = resource;

	$: ({ cost, name, amountType, amountTotal, amountUnit, productLink } = resource);
</script>

<li>
	<EditTemplate
		onUpdate={() => resourcesList.editResource(editedResource)}
		onDelete={() => resourcesList.removeResource(resource)}
		bind:currentValue={resource}
		bind:editingValue={editedResource}
	>
		<p slot="display">
			<a href={`/resource/${name}`}>{name}</a>
			- ${cost} for
			{amountTotal}{amountUnit}
			({amountType})
		</p>

		<Inputs slot="editing" bind:resourceToCreateOrUpdate={editedResource} />
	</EditTemplate>
</li>

<style>
	li {
		display: flex;
		gap: 10px;
		align-items: center;
		text-wrap: nowrap;
	}
</style>
