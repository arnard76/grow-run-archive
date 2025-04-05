<script lang="ts">
	import Icon from '@iconify/svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let editText = 'Update';
	export let finishEditingText = 'Save Changes';
	export let deleteText = 'Delete';

	export let onUpdate: (() => any) | undefined = undefined;
	export let onCancel: (() => any) | undefined = undefined;
	export let onDelete: (() => any) | undefined = undefined;

	export let editMode = false;
</script>

{#if editMode}
	<form>
		<slot name="editing" />
		<div>
			{#if onUpdate}
				<button
					title={finishEditingText}
					on:click={() => {
						onUpdate();
						editMode = false;
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
						editMode = false;
					}}
				>
					<Icon icon="tabler:trash" />
				</button>
			{/if}

			<CancelButton
				on:click={() => {
					if (onCancel) onCancel();
					editMode = false;
				}}
			/>
		</div>
	</form>
{:else}
	<div class="flex items-top gap-4 flex-wrap">
		<slot name="display" />
		<button on:click={() => (editMode = true)} title={editText}>
			<Icon icon="tabler:pencil" />
		</button>
	</div>
{/if}
