<script lang="ts">
	import Modal from './Modal.svelte';

	let askForConfirmation = false;
	export let actionToConfirm = () => null as any;
</script>

<div on:click={() => (askForConfirmation = true)} on:keypress role="button" tabindex="0">
	<slot />
</div>

{#if askForConfirmation}
	<Modal onClose={() => (askForConfirmation = false)}>
		<p>Are you sure?</p>
		<button
			title="Confirm Action"
			on:click={() => {
				actionToConfirm();
				askForConfirmation = false;
			}}>Yes</button
		>
		<button title="Cancel Action" on:click={() => (askForConfirmation = false)}>No</button>
	</Modal>
{/if}
