<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	export let showActionsMenu = false;
	export let actions: string[];

	let searchTermForAction = '';

	$: if (showActionsMenu === false) searchTermForAction = '';

	$: filteredActions = actions.filter((action) =>
		action.toLowerCase().includes(searchTermForAction.toLowerCase())
	);
</script>

<svelte:body
	on:keypress|capture={(e) => {
		if (e.key === '/') {
			e.preventDefault();
			e.stopPropagation();
			showActionsMenu = !showActionsMenu;
		}
	}}
/>

{#if showActionsMenu}
	<Modal onClose={() => (showActionsMenu = false)}>
		<!-- SEARCH BAR -->
		{#if actions.length > 1}
			<input type="text" bind:value={searchTermForAction} placeholder="Search actions" />
		{/if}

		<!-- ACTIONS -->
		<div class="flex flex-col items-start gap-2 text-nowrap mt-2">
			<slot {filteredActions} />
		</div>
	</Modal>
{/if}
