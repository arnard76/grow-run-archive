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
	{/if}

	<div class="w-full">
		{#if anyRecords}
			{#if expandRecords}
				<button on:click={() => (expandRecords = !expandRecords)}>Hide records 🔼</button>
				<ul class="flex flex-col items-center mt-4">
					{#each Object.entries(growRun.conditions[conditionName] || {}) as [_, conditionMeasurement] (conditionMeasurement.dateTime)}
						<Measurement {conditionName} {conditionMeasurement} {timezone} />
					{/each}
				</ul>

				<button on:click={() => (expandRecords = !expandRecords)}>Hide records 🔼</button>
			{:else}
				<button on:click={() => (expandRecords = !expandRecords)}>Show records 🔽</button>
			{/if}
		{:else}
			<p class="inline">
				No {verboseConditionName(conditionName)} measurements have been recorded:
			</p>
		{/if}
	</div>
</section>
