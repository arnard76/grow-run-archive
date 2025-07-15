<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import { Resource } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import Preview from './Preview.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import Icon from '@iconify/svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';
	import EditButton from '$lib/components/EditButton.svelte';

	export let resource: Resource;

	let expanded = false;
	let editing = false;
	let editingResource: Resource = resource;
</script>

<tr>
	<Preview {resource} on:click={() => (expanded = !expanded)} />
</tr>

{#if expanded}
	<tr>
		<td colspan="10">
			<button on:click={() => (editing = !editing)} title={resourceActionNames.edit}>
				<EditButton />
			</button>
			{#if editing}
				<ActionTemplate
					actionName="edit resource"
					onComplete={() => {
						resourcesList.editResource(resource);
						editing = false;
					}}
					onCancel={() => (editing = false)}
				>
					<Inputs bind:resourceToCreateOrUpdate={editingResource} />

					<ConfirmActionModal actionToConfirm={() => resourcesList.removeResource(resource)}>
						<button title={resourceActionNames.delete} class="danger">
							<Icon icon="tabler:trash" />
						</button>
					</ConfirmActionModal>
				</ActionTemplate>
			{/if}

			<p>{resource.notes}</p>
		</td>
	</tr>
{/if}

<style>
	tr {
		cursor: pointer;
	}
</style>
