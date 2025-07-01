<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import { verboseConditionName, type ConditionsMeasurements } from '@grow-run-archive/definitions';
	import DefaultFullPeriodGraph from './FullPeriodGraph.svelte';
	import Measurement from './measurement/View.svelte';
	import DefaultTimeOfDayGraph from './TimeOfDayGraph.svelte';
	import ToggleCharts from './ToggleCharts.svelte';

	export let FullPeriodGraph: null | typeof DefaultFullPeriodGraph = DefaultFullPeriodGraph;
	export let TimeOfDayGraph: null | typeof DefaultTimeOfDayGraph = DefaultTimeOfDayGraph;

	export let growRun: GrowRun;
	export let timezone: string;
	export let conditionName: keyof ConditionsMeasurements;

	let expandRecords = false;
	$: anyRecords = Object.keys(growRun.conditions[conditionName] || {})?.length;
</script>

<section>
	<h3>{verboseConditionName(conditionName)}</h3>
	{#if anyRecords}
		<ToggleCharts
			{growRun}
			conditionNames={[conditionName]}
			{FullPeriodGraph}
			{TimeOfDayGraph}
			{timezone}
		/>
	{:else}
		<p class="inline">
			No {verboseConditionName(conditionName)} measurements have been recorded:
		</p>
	{/if}
</section>
