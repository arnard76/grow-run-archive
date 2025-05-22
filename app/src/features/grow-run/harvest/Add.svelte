<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsAPI } from '$features/grow-run/store';
	import type GrowRun from '$features/grow-run';
	import Inputs from './Inputs.svelte';
	import type { Harvest } from '@grow-run-archive/definitions';

	export let growRun: GrowRun;

	let harvest: Harvest = {} as Harvest;

	function addHarvest() {
		if (!harvest) return;
		growRun.recordHarvest(harvest);
		growRunsAPI.updatePartial(growRun.id, { harvests: growRun.harvests });
		harvest = {} as Harvest;
	}
</script>

<AddTemplate onAdd={addHarvest} addText="Record">
	<Inputs bind:harvest />
</AddTemplate>
