<script lang="ts">
	import EditButton from '$lib/components/EditButton.svelte';
	import { GrowSetup, growSetupActionNames } from '@grow-run-archive/definitions';
	import EditAction from './EditAction.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let growSetup: GrowSetup;
	let showActionsMenu = false;
</script>

<div class="group m-4 relative">
	<button
		title={growSetupActionNames.openActions}
		on:click={() => (showActionsMenu = !showActionsMenu)}
	>
		<EditButton />
	</button>
	<Modal onClose={() => (showActionsMenu = false)}>
		<EditAction closeModal={() => null} {growSetup} />
	</Modal>
</div>
