<script lang="ts">
	import Icon from '@iconify/svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let editText = 'Update';
	export let finishEditingText = 'Save Changes';
	export let deleteText = 'Delete';

	export let onUpdate = () => null;
	export let onCancel = () => null;
	export let onDelete = () => null;

	export let expanded = false;
</script>

{#if expanded}
	<form>
		<slot name="editing" />
		<div>
			<button
				title={finishEditingText}
				on:click={() => {
					onUpdate();
					expanded = !expanded;
				}}
			>
				<Icon icon="tabler:pencil-check" />
			</button>

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

			<CancelButton
				on:click={() => {
					onCancel();
					expanded = !expanded;
				}}
			/>
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
