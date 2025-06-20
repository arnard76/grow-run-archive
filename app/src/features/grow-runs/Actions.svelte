<script lang="ts">
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import AddAction from './AddAction.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import Icon from '@iconify/svelte';

	let showActionsMenu = false;

	let actions = [growRunActionNames.add];
</script>

<div class="group m-4 relative">
	<button title="Actions for Grow Runs" on:click={() => (showActionsMenu = !showActionsMenu)}>
		<Icon icon="tabler:dots" />
	</button>
	<ActionsMenuModal bind:showActionsMenu {actions} let:filteredActions>
		<AddAction closeModal={() => (showActionsMenu = false)} />
	</ActionsMenuModal>
</div>
