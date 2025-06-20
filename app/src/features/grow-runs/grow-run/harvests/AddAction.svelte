<script lang="ts">
	import { growRunsAPI } from '$features/grow-runs/grow-run/store';
	import type GrowRun from '$features/grow-runs/grow-run';
	import Inputs from './Inputs.svelte';
	import { growRunActionNames, type Harvest } from '@grow-run-archive/definitions';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let harvest: Harvest = {} as Harvest;

	function addHarvest() {
		if (!harvest) return;
		growRun.recordHarvest(harvest);
		growRunsAPI.updatePartial(growRun.id, { harvests: growRun.harvests });
		harvest = {} as Harvest;
	}
</script>

<ActionTemplate
	actionName={growRunActionNames.recordHarvest}
	onComplete={addHarvest}
	onCancel={closeModal}
>
	<Inputs bind:harvest />
</ActionTemplate>
