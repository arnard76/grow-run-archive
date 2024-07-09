<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import TemperatureSection from './temperature/Section.svelte';
	import FullPeriodLineGraph from './temperature/FullPeriodLineGraph.svelte';
	import SummaryLineGraph from './temperature/SummaryLineGraph.svelte';
	import TimezoneInput from './TimezoneInput.svelte';
	import WaterLevelSection from './water-level/Section.svelte';

	export let growRun: GrowRun;

	$: anyTempsRecorded =
		[
			...(growRun.conditions['water-temperature'] || []),
			...(growRun.conditions['air-temperature'] || [])
		]?.length != 0;

	let timezone: string;
</script>

<section>
	<h2>Conditions</h2>
	<TimezoneInput bind:timezone />
	<div style="display: flex;">
		<div style={anyTempsRecorded ? 'max-width: 50%;' : ''}>
			<h3>Air temperature</h3>
			<TemperatureSection {growRun} medium="air-temperature" {timezone} />

			<h3 class="mt-8">Water temperature</h3>
			<TemperatureSection {growRun} medium="water-temperature" {timezone} />
		</div>
		<div style="flex: 1;">
			{#if anyTempsRecorded}
				<FullPeriodLineGraph {growRun} {timezone} />
				<SummaryLineGraph {growRun} {timezone} />
			{/if}
		</div>
	</div>
	<WaterLevelSection {growRun} {timezone} />
</section>
