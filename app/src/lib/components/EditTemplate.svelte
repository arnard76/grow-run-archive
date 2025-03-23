<script lang="ts">
	import Icon from '@iconify/svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let editText = 'Update';
	export let finishEditingText = 'Save Changes';
	export let deleteText = 'Delete';

	export let onUpdate: (() => any) | undefined = undefined;
	export let onCancel: (() => any) | undefined = undefined;
	export let onDelete: (() => any) | undefined = undefined;

	export let expanded = false;
</script>

{#if expanded}
	<form>
		<slot name="editing" />
		<div>
			{#if onUpdate}
				<button
					title={finishEditingText}
					on:click={() => {
						onUpdate();
						expanded = !expanded;
					}}
				>
					<Icon icon="tabler:pencil-check" />
				</button>
			{/if}

			{#if onDelete}
				<button
					title={deleteText}
					class="danger"
					on:click={() => {
						onDelete();
						expanded = !expanded;
					}}
				>
					<Icon icon="tabler:trash" />
				</button>
			{/if}

			{#if onCancel}
				<CancelButton
					on:click={() => {
						onCancel();
						expanded = !expanded;
					}}
				/>
			{/if}
		</div>
	</form>
{:else}
	<div class="flex items-top gap-4">
		<slot name="display" />
		<button on:click={() => (expanded = !expanded)} title={editText}>
			<Icon icon="tabler:pencil" />
		</button>
	</div>
{/if}
