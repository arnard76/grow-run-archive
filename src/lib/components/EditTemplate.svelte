<script lang="ts">
	export let editText = '✔️';

	export let onUpdate: (e: MouseEvent) => any;
	export let onDelete: ((e: MouseEvent) => any) | null = null;

	export let expanded = false;
</script>

{#if expanded}
	<slot name="editing" />
	<button
		title="Update"
		on:click={(e) => {
			onUpdate(e);
			expanded = !expanded;
		}}
	>
		{editText}
	</button>

	{#if onDelete}
		<button
			title="Delete"
			on:click={(e) => {
				onDelete(e);
				expanded = !expanded;
			}}
			>💩
		</button>
	{/if}

	<button title="Cancel" on:click={() => (expanded = !expanded)}>Cancel</button>
{:else}
	<div class="flex items-top gap-4">
		<slot name="display" />
		<button on:click={(e) => (expanded = !expanded)}>✏️</button>
	</div>
{/if}
