<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';
	import type { WaterLevelRecord } from './types';

	export let growRun: GrowRun;

	let waterLevelRecord: WaterLevelRecord = {} as WaterLevelRecord;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordWaterLevel(waterLevelRecord);
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:waterLevelRecord />
</AddTemplate>
