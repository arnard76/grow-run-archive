<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import TemperatureSection from './temperature/Section.svelte';
	import FullPeriodLineGraph from './temperature/FullPeriodLineGraph.svelte';
	import SummaryLineGraph from './temperature/SummaryLineGraph.svelte';
	import TimezoneInput from './TimezoneInput.svelte';

	export let growRun: GrowRun;

	$: anyTempsRecorded =
		[
			...(growRun.conditions['water-temperature'] || []),
			...(growRun.conditions['air-temperature'] || [])
		]?.length != 0;

	let timezone: string;
</script>

<h4>Conditions</h4>
<TimezoneInput bind:timezone />
<div style="display: flex;">
	<div style={anyTempsRecorded ? 'max-width: 50%;' : ''}>
		<p>Air temperature:</p>
		<TemperatureSection {growRun} medium="air-temperature" {timezone} />

		<p>Water temperature:</p>
		<TemperatureSection {growRun} medium="water-temperature" {timezone} />
	</div>
	<div style="flex: 1;">
		{#if anyTempsRecorded}
			<FullPeriodLineGraph {growRun} {timezone} />
			<!-- <SummaryLineGraph {growRun} /> -->
		{/if}
	</div>
</div>
