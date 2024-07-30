<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import FullPeriodLineGraph from './condition/FullPeriodGraph.svelte';
	import TimeOfDayGraph from './condition/TimeOfDayGraph.svelte';
	import TimezoneInput from './TimezoneInput.svelte';
	import ConditionSection from './condition/StandardSection.svelte';
	import ToggleCharts from './condition/ToggleCharts.svelte';

	export let growRun: GrowRun;

	$: anyTempsRecorded =
		Object.keys({
			...(growRun.conditions['water-temperature'] || {}),
			...(growRun.conditions['air-temperature'] || {})
		}).length != 0;

	let timezone: string;
</script>

<section>
	<h2>Conditions</h2>
	<TimezoneInput bind:timezone />
	<div>
		<div>
			<ConditionSection
				{growRun}
				{timezone}
				conditionName="air-temperature"
				FullPeriodGraph={null}
				TimeOfDayGraph={null}
			/>

			<ConditionSection
				{growRun}
				{timezone}
				conditionName="water-temperature"
				FullPeriodGraph={null}
				TimeOfDayGraph={null}
			/>
		</div>
		<div>
			{#if anyTempsRecorded}
				<ToggleCharts
					FullPeriodGraph={FullPeriodLineGraph}
					{TimeOfDayGraph}
					conditionNames={['air-temperature', 'water-temperature']}
					yAxisTitle="temperature"
					{growRun}
					{timezone}
				></ToggleCharts>
			{/if}
		</div>
	</div>
	<ConditionSection {growRun} {timezone} conditionName="humidity" />
	<ConditionSection {growRun} {timezone} conditionName="water-level" />
	<ConditionSection {growRun} {timezone} conditionName="pH" />
	<ConditionSection {growRun} {timezone} conditionName="illuminance" />
</section>
