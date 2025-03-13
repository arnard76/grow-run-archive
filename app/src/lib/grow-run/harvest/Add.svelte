<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsAPI } from '$lib/grow-run/store';
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
		growRunsAPI.updatePartial(growRun.id, { harvests: growRun.harvests });
	}}
	addText="Record"
>
	<Inputs bind:harvest />
</AddTemplate>
