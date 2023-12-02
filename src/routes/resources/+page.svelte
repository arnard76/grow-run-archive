<script lang="ts">
	import { resourcesList } from '$lib/grow-run/stores';
	import Resource from '$lib/resource/Resource.svelte';
	import ResourceClass from '$lib/resource/resource';
	import Inputs from '$lib/resource/Inputs.svelte';
	import AddTemplate from '$lib/components/AddTemplate.svelte';

	let cost: number, amountTotal: number, amountType: string, amountUnit: string, name: string;
</script>

{#each $resourcesList as resource (resource.name)}
	<Resource {resource} />
{/each}

<AddTemplate
	addText="Add to list"
	onClick={() => {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		resourcesList.addNewResource(
			new ResourceClass(name, cost, amountType, amountUnit, amountTotal, randomColour, '')
		);
	}}
>
	<Inputs bind:cost bind:name bind:amountType bind:amountTotal bind:amountUnit />
</AddTemplate>
