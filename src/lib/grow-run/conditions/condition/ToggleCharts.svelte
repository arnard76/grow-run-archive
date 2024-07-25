<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import type ConditionsMeasurements from '../conditions';
	import DefaultFullPeriodGraph from './FullPeriodGraph.svelte';
	import DefaultTimeOfDayGraph from './TimeOfDayGraph.svelte';
	import Toggle from 'svelte-toggle';

	export let FullPeriodGraph: null | typeof DefaultFullPeriodGraph = DefaultFullPeriodGraph;
	export let TimeOfDayGraph: null | typeof DefaultTimeOfDayGraph = DefaultTimeOfDayGraph;

	export let growRun: GrowRun;
	export let conditionNames: (keyof ConditionsMeasurements)[];
	export let yAxisTitle: string = conditionNames[0];
	export let timezone: string;

	let showTimeOfDayGraph = false; // if false then show the time of day graph
</script>

<div class="text-center">
	{#if FullPeriodGraph && TimeOfDayGraph}
		<div class="flex gap-4">
			<h5>Entire grow run</h5>
			<Toggle hideLabel bind:toggled={showTimeOfDayGraph} />
			<h5>Time of day</h5>
		</div>
	{/if}

	{#if FullPeriodGraph && !showTimeOfDayGraph}
		<FullPeriodGraph {growRun} {timezone} {conditionNames} {yAxisTitle} />
	{:else if TimeOfDayGraph}
		<TimeOfDayGraph {growRun} {timezone} {conditionNames} {yAxisTitle} />
	{/if}
</div>
