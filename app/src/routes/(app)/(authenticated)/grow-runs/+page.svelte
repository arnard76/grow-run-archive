<script lang="ts">
	import { growRuns } from '$features/grow-run/store';
	import GrowRun from '$features/grow-run/ListItem.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import AddAction from '$features/grow-run/AddAction.svelte';

	let showActionsMenu = false;
</script>

<main class="p-2">
	<h1>Grow Runs</h1>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Output (g)</th>
				<th>Cost (NZD)</th>
				<th>Cost per 100g (NZD)</th>
			</tr>
		</thead>

		<tbody>
			{#each $growRuns as growRun}
				<GrowRun {growRun} />
			{/each}
		</tbody>
	</table>

	<ActionsMenuModal bind:showActionsMenu actions={[growRunActionNames.add]}>
		<AddAction closeModal={() => (showActionsMenu = false)} />
	</ActionsMenuModal>
</main>
