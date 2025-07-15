<script lang="ts">
	import AddAction from '$features/resources/AddAction.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';

	let showActionsMenu = false;
</script>

<div class="group m-4 relative">
	<button
		title={resourceActionNames.openActions}
		on:click={() => (showActionsMenu = !showActionsMenu)}
	>
		<Icon icon="tabler:dots" />
	</button>
	<ActionsMenuModal bind:showActionsMenu actions={[resourceActionNames.add]}>
		<AddAction closeModal={() => (showActionsMenu = false)} />
	</ActionsMenuModal>
</div>
