<script lang="ts">
	import Button from './Button.svelte';

	export let editText = '✔️';

	export let onUpdate: (e: MouseEvent) => any;
	export let onDelete: ((e: MouseEvent) => any) | null = null;

	export let currentValue: any;
	export let editingValue: any;

	export let expanded = false;
</script>

{#if expanded}
	<slot name="editing" {editingValue} />

	<Button
		title="Update"
		on:click={(e) => {
			onUpdate(e);
			currentValue = editingValue;
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

	<Button
		title="Cancel editing"
		on:click={() => {
			editingValue = currentValue;
			expanded = !expanded;
		}}>🔙</Button
	>
{:else}
	<slot name="display" />
	<Button on:click={(e) => (expanded = !expanded)}>✏️</Button>
{/if}
