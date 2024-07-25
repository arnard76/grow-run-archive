<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '$lib/grow-run/store';
	import Add from './Add.svelte';
	import ListItem from './ListItem.svelte';
	import DefaultFullPeriodGraph from './FullPeriodLineGraph.svelte';
	import DefaultTimeOfDayGraph from './SummaryLineGraph.svelte';
	import type ConditionsMeasurements from '../conditions';
	import { toVerbose } from '../conditions';
	import Toggle from 'svelte-toggle';

	export let FullPeriodGraph: any = DefaultFullPeriodGraph;
	export let TimeOfDayGraph: any = DefaultTimeOfDayGraph;

	export let growRun: GrowRun;
	export let timezone: string;
	export let conditionName: keyof ConditionsMeasurements;

	let showTimeOfDayGraph = false; // if false then show the time of day graph
	let expandRecords = false;
	$: anyRecords = Object.keys(growRun.conditions[conditionName] || {})?.length;
</script>

<section>
	<h3>{toVerbose(conditionName)}</h3>
	{#if anyRecords}
		<div class="text-center">
			{#if FullPeriodGraph && TimeOfDayGraph}
				<div class="flex gap-4">
					<h5>Entire grow run</h5>
					<Toggle hideLabel bind:toggled={showTimeOfDayGraph} />
					<h5>Time of day</h5>
				</div>
			{/if}
			{#if FullPeriodGraph && !showTimeOfDayGraph}
				<FullPeriodGraph {growRun} {timezone} {conditionName} />
			{:else if TimeOfDayGraph}
				<TimeOfDayGraph {growRun} {timezone} {conditionName} />
			{/if}
		</div>
	{/if}

	<div class="w-full">
		{#if anyRecords}
			{#if expandRecords}
				<button on:click={() => (expandRecords = !expandRecords)}> Hide records 🔼</button>
				<Add {conditionName} {growRun} />
				<ul class="flex flex-col items-center mt-4">
					{#each Object.entries(growRun.conditions[conditionName] || {}) as [_, conditionMeasurement] (conditionMeasurement.dateTime)}
						<ListItem
							{conditionName}
							{conditionMeasurement}
							{timezone}
							onUpdate={(conditionMeasurement) => {
								growRunsStore.updateGrowRun(growRun);
							}}
						/>
					{/each}
				</ul>

				<button on:click={() => (expandRecords = !expandRecords)}> Hide records 🔼</button>
			{:else}
				<button on:click={() => (expandRecords = !expandRecords)}>Show records 🔽</button>
			{/if}
		{:else}
			<p>
				Currently, no {toVerbose(conditionName).toLowerCase()} measurements have been measured AND recorded.
				Feel free to add below:
			</p>
		{/if}
		<Add {conditionName} {growRun} />
	</div>
</section>
