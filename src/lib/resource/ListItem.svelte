<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { resourcesList } from '$lib/resource/store';
	import type Resource from '$lib/resource';
	import Inputs from './Inputs.svelte';
	export let resource: Resource;

	$: ({ cost, name, amountType, amountTotal, amountUnit, productLink } = resource);
</script>

<li>
	<EditTemplate
		onUpdate={() => resourcesList.editResource(resource)}
		onDelete={() => resourcesList.removeResource(resource)}
	>
		<p slot="display">
			<a href={`/resource/${name}`}>{name}</a>
			- ${cost} for
			{amountTotal}{amountUnit}
			({amountType})
		</p>

		<Inputs slot="editing" bind:resourceToCreateOrUpdate={resource} />
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
