<script lang="ts">
	import Icon from '@iconify/svelte';

	export let editText = 'Update';
	export let deleteText = 'Delete';

	export let onUpdate: (e: MouseEvent) => any;
	export let onDelete: ((e: MouseEvent) => any) | null = null;

	export let expanded = false;
</script>

{#if expanded}
	<slot name="editing" />
	<button
		title={editText}
		on:click={(e) => {
			onUpdate(e);
			expanded = !expanded;
		}}
	>
		<Icon icon="tabler:pencil-check" />
	</button>

	{#if onDelete}
		<button
			title={deleteText}
			class="danger"
			on:click={(e) => {
				onDelete(e);
				expanded = !expanded;
			}}
		>
			<Icon icon="tabler:trash" />
		</button>
	{/if}

	<button title="Cancel" on:click={() => (expanded = !expanded)}>Cancel</button>
{:else}
	<div class="flex items-top gap-4">
		<slot name="display" />
		<button on:click={(e) => (expanded = !expanded)}>
			<Icon icon="tabler:pencil" />
		</button>
	</div>
{/if}
