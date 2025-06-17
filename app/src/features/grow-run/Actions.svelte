<script lang="ts">
	import Popover from '$lib/components/Popover.svelte';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';
	import { growRunsAPI } from './store';
	import { goto } from '$app/navigation';
	import GrowRun from '.';
	import Modal from '$lib/components/Modal.svelte';
	import UseResource from './resource-usages/AddAction.svelte';
	import ChangeLocation from './details/location/Action.svelte';
	import RecordHarvest from './harvests/AddAction.svelte';
	import RecordConditionMeasurement from './conditions/RecordConditionMeasurementAction.svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';
	import dayjs from '@grow-run-archive/dayjs';
	import Export from './ExportAction.svelte';
	import RenameAction from './details/RenameAction.svelte';
	import ManageImages from './details/photos/Action.svelte';

	export let growRun: GrowRun;
	let actions = [
		// DETAILS
		growRunActionNames.rename,
		growRunActionNames.export,
		// growRunActionNames.start,
		// growRunActionNames.end,
		growRunActionNames.changeLocation,
		growRunActionNames.manageImages,
		// growRunActionNames.delete,

		growRunActionNames.useResource,
		growRunActionNames.recordHarvest,
		growRunActionNames.recordEnvironmentalCondition
	];

	let openAction: null | string = null;

	function openActionModal(actionName: (typeof actions)[0]) {
		openAction = actionName;
	}

	export let showActionsMenu = false;

	document.querySelector('body')?.addEventListener('keypress', (e) => {
		if (e.key === '/') {
			showActionsMenu = !showActionsMenu;
		}
	});

	function closeModal() {
		openAction = null;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="group m-4 relative">
	<button title="Grow Run Actions" on:click={() => (showActionsMenu = !showActionsMenu)}
		><Icon icon="tabler:dots" /></button
	>
	<Popover bind:show={showActionsMenu}>
		<div class="flex flex-col items-start gap-2 text-nowrap">
			<ConfirmActionModal
				actionToConfirm={() => {
					growRunsAPI.updatePartial(growRun.id, {
						duration: { ...growRun.duration, start: dayjs().toISOString() }
					});
				}}
			>
				<button title={growRunActionNames.start}>{growRunActionNames.start}</button>
			</ConfirmActionModal>
			{#each actions as action (action)}
				<button on:click={() => openActionModal(action)}>{action}</button>
			{/each}
			<ConfirmActionModal
				actionToConfirm={() => {
					growRunsAPI.updatePartial(growRun.id, {
						duration: { ...growRun.duration, end: dayjs().toISOString() }
					});
				}}
			>
				<button title={growRunActionNames.end}>{growRunActionNames.end}</button>
			</ConfirmActionModal>
			<ConfirmActionModal
				actionToConfirm={() => {
					growRunsAPI.delete(growRun.id);
					goto('/grow-runs');
				}}
			>
				<button title={growRunActionNames.delete} class="danger">
					<Icon icon="tabler:trash" />
				</button>
			</ConfirmActionModal>
		</div>
	</Popover>

	{#if openAction}
		<Modal onClose={closeModal}>
			{openAction}
			{#if openAction === growRunActionNames.rename}
				<RenameAction {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.changeLocation}
				<ChangeLocation {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.useResource}
				<UseResource {growRun} />
			{:else if openAction === growRunActionNames.recordHarvest}
				<RecordHarvest {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.recordEnvironmentalCondition}
				<RecordConditionMeasurement {growRun} />
			{:else if openAction === growRunActionNames.export}
				<Export {growRun} />
			{:else if openAction === growRunActionNames.manageImages}
				<ManageImages {growRun} {closeModal} />
			{/if}
		</Modal>
	{/if}
</div>
