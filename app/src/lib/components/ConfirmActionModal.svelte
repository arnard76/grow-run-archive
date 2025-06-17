<script lang="ts">
	import Modal from './Modal.svelte';

	let askForConfirmation = false;
	export let actionToConfirm = () => null as any;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => (askForConfirmation = true)}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			askForConfirmation = true;
		}
	}}
>
	<slot />
</div>

{#if askForConfirmation}
	<Modal onClose={() => (askForConfirmation = false)}>
		<p>Are you sure?</p>
		<button
			title="Confirm Action"
			on:click|stopPropagation={() => {
				askForConfirmation = false;
				actionToConfirm();
			}}>Yes</button
		>
		<button title="Cancel Action" on:click|stopPropagation={() => (askForConfirmation = false)}
			>No</button
		>
	</Modal>
{/if}
