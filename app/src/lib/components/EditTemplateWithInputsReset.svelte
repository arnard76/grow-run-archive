<script lang="ts">
	/** This component handles displaying and editing of a object or property
	 *
	 * On cancel:
	 *  - the displayed value shouldn't change (displayed only changes when db updates)
	 *  - if editing again, the previous inputs should be cleared and reset to what the db is
	 */

	import EditTemplate from './EditTemplate.svelte';

	export let editText = 'Update';
	export let finishEditingText = 'Save Changes';
	export let deleteText = 'Delete';

	export let onUpdate: (() => any) | undefined = undefined;
	export let onCancel: (() => any) | undefined = undefined;
	export let onDelete: (() => any) | undefined = undefined;

	export let currentValue: any;
	export let editedValue = structuredClone(currentValue);

	export let editMode = false;
</script>

<EditTemplate
	{editText}
	{finishEditingText}
	{deleteText}
	{onUpdate}
	onCancel={() => {
		editedValue = structuredClone(currentValue);
		if (onCancel) onCancel();
	}}
	{onDelete}
	{editMode}
>
	<svelte:fragment slot="editing">
		<slot name="editing" />
	</svelte:fragment>
	<svelte:fragment slot="display">
		<slot name="display" />
	</svelte:fragment>
</EditTemplate>
