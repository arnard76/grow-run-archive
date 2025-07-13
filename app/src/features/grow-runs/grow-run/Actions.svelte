<script lang="ts">
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';
	import { growRunsAPI } from './store';
	import { goto } from '$app/navigation';
	import GrowRun from '.';
	import Modal from '$lib/components/Modal.svelte';
	import UseResource from './resource-usages/AddAction.svelte';
	import ChangeGrowSetup from './details/grow-setup/Action.svelte';
	import ChangeLocation from './details/location/Action.svelte';
	import RecordHarvest from './harvests/AddAction.svelte';
	import MeasureEnvironmentalCondition from './conditions/MeasureEnvironmentalConditionAction.svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';
	import dayjs from '@grow-run-archive/dayjs';
	import Export from './ExportAction.svelte';
	import RenameAction from './details/RenameAction.svelte';
	import ManageImages from './details/photos/Action.svelte';
	import ActionsMenuModal from '$lib/components/ActionsMenuModal.svelte';

	export let growRun: GrowRun;

	let showActionsMenu = false;
	let actions = [
		growRunActionNames.rename,
		growRunActionNames.export,
		growRunActionNames.start,
		growRunActionNames.end,
		growRunActionNames.changeLocation,
		growRunActionNames.changeGrowSetup,
		growRunActionNames.manageImages,

		growRunActionNames.useResource,
		growRunActionNames.recordHarvest,
		growRunActionNames.measureEnvironmentalCondition,

		growRunActionNames.delete
	];

	let openAction: null | string = null;
	$: if (!showActionsMenu) openAction = null;

	function openActionModal(actionName: (typeof actions)[0]) {
		openAction = actionName;
	}

	function closeModal() {
		openAction = null;
	}
</script>

<div class="group m-4 relative">
	<button title="Grow Run Actions" on:click={() => (showActionsMenu = !showActionsMenu)}>
		<Icon icon="tabler:dots" />
	</button>
	<ActionsMenuModal bind:showActionsMenu {actions} let:filteredActions>
		{#each filteredActions as action (action)}
			{#if action === growRunActionNames.start}
				<ConfirmActionModal
					actionToConfirm={() => {
						growRunsAPI.updatePartial(growRun.id, {
							duration: { ...growRun.duration, start: dayjs().toISOString() }
						});
					}}
				>
					<button title={growRunActionNames.start}>
						{growRunActionNames.start}
					</button>
				</ConfirmActionModal>
			{:else if action === growRunActionNames.end}
				<ConfirmActionModal
					actionToConfirm={() => {
						growRunsAPI.updatePartial(growRun.id, {
							duration: { ...growRun.duration, end: dayjs().toISOString() }
						});
					}}
				>
					<button title={growRunActionNames.end}>
						{growRunActionNames.end}
					</button>
				</ConfirmActionModal>
			{:else if action === growRunActionNames.delete}
				<ConfirmActionModal
					actionToConfirm={() => {
						growRunsAPI.delete(growRun.id);
						goto('/grow-runs');
					}}
				>
					<button class="danger" title={growRunActionNames.delete}>
						<Icon icon="tabler:trash" />
					</button>
				</ConfirmActionModal>
			{:else}
				<button title={action} on:click={() => openActionModal(action)}>{action}</button>
			{/if}
		{/each}
	</ActionsMenuModal>

	{#if openAction}
		<Modal onClose={closeModal}>
			{#if openAction === growRunActionNames.rename}
				<RenameAction {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.changeGrowSetup}
				<ChangeGrowSetup {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.changeLocation}
				<ChangeLocation {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.useResource}
				<UseResource {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.recordHarvest}
				<RecordHarvest {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.measureEnvironmentalCondition}
				<MeasureEnvironmentalCondition {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.export}
				<Export {growRun} {closeModal} />
			{:else if openAction === growRunActionNames.manageImages}
				<ManageImages {growRun} {closeModal} />
			{/if}
		</Modal>
	{/if}
</div>
