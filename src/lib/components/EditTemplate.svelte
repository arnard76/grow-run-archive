<script lang="ts">
	import Button from './Button.svelte';

	export let editText = '✔️';
	export let onClick: (e: MouseEvent) => any;
	export let onDeleteClick: ((e: MouseEvent) => any) | null = null;

	export let expanded = false;
</script>

{#if expanded}
	<slot name="editing" />
	<Button
		title="Update"
		on:click={(e) => {
			onClick(e);
			expanded = !expanded;
		}}
	>
		{editText}
	</Button>
	{#if onDeleteClick}
		<Button
			title="Delete"
			on:click={(e) => {
				onDeleteClick && onDeleteClick(e);
				expanded = !expanded;
			}}>💩</Button
		>{/if}
{:else}
	<slot name="display" />
	<Button on:click={(e) => (expanded = !expanded)}>✏️</Button>
{/if}
