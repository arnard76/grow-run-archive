<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';
	import { type ConditionMeasurement } from '../conditions';

	export let growRun: GrowRun;

	let waterLevelRecord: ConditionMeasurement = {} as ConditionMeasurement;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordCondition('water-level', waterLevelRecord);
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:waterLevelRecord />
</AddTemplate>
