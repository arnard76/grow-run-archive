<script lang="ts">
	import Button from './Button.svelte';

	export let editText = '✔️';

	export let onUpdate: (e: MouseEvent) => any;
	export let onDelete: ((e: MouseEvent) => any) | null = null;

	export let expanded = false;
</script>

{#if expanded}
	<slot name="editing" />
	<Button
		title="Update"
		on:click={(e) => {
			onUpdate(e);
			expanded = !expanded;
		}}
	>
		{editText}
	</Button>

	{#if onDelete}
		<Button
			title="Delete"
			on:click={(e) => {
				onDelete && onDelete(e);
				expanded = !expanded;
			}}
			>💩
		</Button>
	{/if}
{:else}
	<slot name="display" />
	<Button on:click={(e) => (expanded = !expanded)}>✏️</Button>
{/if}
