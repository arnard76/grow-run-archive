<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';
	import type { Harvest } from './types';

	export let growRun: GrowRun;

	let harvest: Harvest = {} as Harvest;
</script>

<AddTemplate
	onClick={() => {
		if (!harvest) return;
		growRun.recordHarvest(harvest);
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:harvest />
</AddTemplate>
