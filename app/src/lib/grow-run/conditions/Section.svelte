<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import ConditionSection from './condition/StandardSection.svelte';
	import TimezoneInput from './TimezoneInput.svelte';

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

	<ConditionSection {growRun} {timezone} conditionName="air-temperature" />
	<ConditionSection {growRun} {timezone} conditionName="water-temperature" />
	<ConditionSection {growRun} {timezone} conditionName="humidity" />
	<ConditionSection {growRun} {timezone} conditionName="water-level" />
	<ConditionSection {growRun} {timezone} conditionName="pH" />
	<ConditionSection {growRun} {timezone} conditionName="average-illuminance-at-netcup" />
</section>
