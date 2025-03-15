<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { resourcesList } from '$lib/resource/store';
	import type Resource from '$lib/resource';
	import Inputs from './Inputs.svelte';
	import Preview from './Preview.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';

	export let resource: Resource;

	let expanded = false;
</script>

<tr>
	<Preview {resource} on:click={() => (expanded = !expanded)} />
</tr>

{#if expanded}
	<tr>
		<td colspan="10">
			<EditTemplate
				onUpdate={() => resourcesList.editResource(resource)}
				onDelete={() => resourcesList.removeResource(resource)}
				deleteText={resourceActionNames.delete}
				editText={resourceActionNames.edit}
			>
				<p slot="display">{resource.notes}</p>
				<Inputs slot="editing" bind:resourceToCreateOrUpdate={resource} />
			</EditTemplate>
		</td>
	</tr>
{/if}

<style>
	tr {
		cursor: pointer;
		background-color: lightblue;
	}
</style>
