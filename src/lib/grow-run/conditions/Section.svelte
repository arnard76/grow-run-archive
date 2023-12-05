<script lang="ts">
	import type GrowRun from '$lib/grow-run/growRun';
	import TemperatureSection from './temperature/Section.svelte';

	export let growRun: GrowRun;

	$: anyTempsRecorded =
		[
			...(growRun.conditions['water-temperature'] || []),
			...(growRun.conditions['air-temperature'] || [])
		]?.length != 0;
</script>

<h4>Conditions</h4>

<div style="display: flex;">
	<div style={anyTempsRecorded ? 'max-width: 50%;' : ''}>
		<p>Air temperature:</p>
		<TemperatureSection {growRun} medium="air-temperature" />

		<p>Water temperature:</p>
		<TemperatureSection {growRun} medium="water-temperature" />
	</div>
</div>
