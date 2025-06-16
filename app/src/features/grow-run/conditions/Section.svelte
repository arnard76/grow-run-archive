<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { environmentalConditions } from '@grow-run-archive/definitions';
	import ConditionSection from './condition/Section.svelte';
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

	{#each environmentalConditions as environmentConditionName}
		<!-- TODO: don't show condition if it doesn't have any data -->
		<!-- Can only do this ☝️☝️ if you can manually add a condition without existing data -->
		<ConditionSection {growRun} {timezone} conditionName={environmentConditionName} />
	{/each}
</section>
