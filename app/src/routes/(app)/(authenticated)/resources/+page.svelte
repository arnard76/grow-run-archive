<script lang="ts">
	import { resourcesList } from '$features/resource/store';
	import Resource from '$features/resource/View.svelte';
	import AddAction from '$features/resource/AddAction.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';

	let showActionsMenu = false;
</script>

<main class="p-2">
	<h1>Resources</h1>
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

	<ActionsMenuModal bind:showActionsMenu actions={[resourceActionNames.add]}>
		<AddAction closeModal={() => (showActionsMenu = false)} />
	</ActionsMenuModal>
</main>
