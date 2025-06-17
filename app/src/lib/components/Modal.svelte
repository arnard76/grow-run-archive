<script lang="ts">
	export let onClose = () => null as any;

	let modal: undefined | HTMLDialogElement;

	$: if (modal) modal.showModal();
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={modal}
	on:close={onClose}
	on:keypress
	on:click={(e) => {
		if (!modal) return;
		const { left, right, top, bottom } = modal.getBoundingClientRect();

		if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
			modal?.close();
		}
	}}
	class="p-0 m-auto border-none rounded-xl drop-shadow-md max-h-[90vh] md:max-w-[75%] w-full"
>
	<div class="p-4">
		<slot />
	</div>
</dialog>
