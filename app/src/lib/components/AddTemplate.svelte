<script lang="ts">
	import Icon from '@iconify/svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let addText = 'Add';
	export let onAdd = () => {};
	export let onCancel = () => {};

	let expanded = false;
</script>

{#if expanded}
	<form>
		<slot />
		<div>
			<button
				on:click={() => {
					onAdd();
					expanded = !expanded;
				}}
				title={addText}
			>
				<Icon icon="tabler:check" />
			</button>

			<CancelButton
				on:click={() => {
					onCancel();
					expanded = !expanded;
				}}
			/>
		</div>
	</form>
{:else}
	<button on:click={(e) => (expanded = !expanded)} title={addText}>
		<Icon icon="tabler:plus" />
	</button>
{/if}
