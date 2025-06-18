<script lang="ts">
	import ChangePasswordAction from '$features/user/ChangePasswordAction.svelte';
	import ExportAction from '$features/user/ExportAction.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { userActionNames } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';
	import { session } from './session';
	import { goto } from '$app/navigation';

	let showActionsMenu = false;
	let logoutAction = userActionNames.logout($session.user!.email!);
	$: actions = [userActionNames.export, logoutAction, userActionNames.changePassword];

	let openAction: null | string = null;

	function openActionModal(actionName: (typeof actions)[0]) {
		openAction = actionName;
	}

	function closeModal() {
		openAction = null;
	}
</script>

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
			{:else if action === logoutAction}
				<button title={action} on:click={() => goto('/logout')}>{action}</button>
			{:else}
				<button title={action} on:click={() => openActionModal(action)}>{action}</button>
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
