<script lang="ts">
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import { userActionNames } from '@grow-run-archive/definitions';
	import ExportAction from '$features/user/ExportAction.svelte';
	import ChangePasswordAction from '$features/user/ChangePasswordAction.svelte';

	let showActionsMenu = false;
	let actions = [userActionNames.export, userActionNames.changePassword];

	let openAction: null | string = null;

	function openActionModal(actionName: (typeof actions)[0]) {
		openAction = actionName;
	}

	function closeModal() {
		openAction = null;
	}
</script>

<main class="p-2">
	<h1>Settings</h1>

	<div class="group m-4 relative">
		<button title="User Actions" on:click={() => (showActionsMenu = !showActionsMenu)}
			><Icon icon="tabler:dots" /></button
		>
		<ActionsMenuModal bind:showActionsMenu {actions} let:filteredActions>
			{#each filteredActions as action (action)}
				{#if action === 'hi'}
					<ConfirmActionModal actionToConfirm={() => {}}>
						<button title={'hi'}> </button>
					</ConfirmActionModal>
				{:else}
					<button title={action} on:click={() => openActionModal(action)} tabindex="0"
						>{action}</button
					>
				{/if}
			{/each}
		</ActionsMenuModal>

		{#if openAction}
			<Modal onClose={closeModal}>
				{#if openAction === userActionNames.export}
					<ExportAction {closeModal} />
				{:else if openAction === userActionNames.changePassword}
					<ChangePasswordAction {closeModal} />
				{/if}
			</Modal>
		{/if}
	</div>
</main>
