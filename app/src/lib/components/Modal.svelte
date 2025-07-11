<script lang="ts">
	export let onClose = () => null as any;

	let modal: undefined | HTMLDialogElement;

	$: if (modal) modal.showModal();
</script>

<svelte:body
	on:click|capture={({ detail, clientX, clientY }) => {
		if (detail === 0) return; // don't close modal for non-mouse click events
		if (!modal) return;
		const { left, right, top, bottom } = modal.getBoundingClientRect();

		if (clientX < left || right < clientX || clientY < top || bottom < clientY) modal?.close();
	}}
/>

<dialog
	bind:this={modal}
	on:close={onClose}
	class="p-0 m-auto border-none rounded-xl drop-shadow-md max-h-[90vh] md:max-w-[75%]"
>
	<div class="p-4">
		<slot />
	</div>
</dialog>
