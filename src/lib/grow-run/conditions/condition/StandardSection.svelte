<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '$lib/grow-run/store';
	import Add from './Add.svelte';
	import ListItem from './ListItem.svelte';
	import DefaultFullPeriodGraph from './FullPeriodGraph.svelte';
	import DefaultTimeOfDayGraph from './TimeOfDayGraph.svelte';
	import type ConditionsMeasurements from '../conditions';
	import { toVerbose } from '../conditions';
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
	<h3>{toVerbose(conditionName)}</h3>
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
				<Add {conditionName} {growRun} />
				<ul class="flex flex-col items-center mt-4">
					{#each Object.entries(growRun.conditions[conditionName] || {}) as [_, conditionMeasurement] (conditionMeasurement.dateTime)}
						<ListItem
							{conditionName}
							{conditionMeasurement}
							{timezone}
							onUpdate={(conditionMeasurement) => growRunsStore.updateGrowRun(growRun)}
						/>
					{/each}
				</ul>

				<button on:click={() => (expandRecords = !expandRecords)}>Hide records 🔼</button>
			{:else}
				<button on:click={() => (expandRecords = !expandRecords)}>Show records 🔽</button>
			{/if}
		{:else}
			<p>
				Currently, no {toVerbose(conditionName).toLowerCase()} measurements have been recorded. Feel
				free to add below:
			</p>
		{/if}
		<Add {conditionName} {growRun} />
	</div>
</section>
