<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import Add from './Add.svelte';
	import ConditionSection from './condition/StandardSection.svelte';
	import TimezoneInput from './TimezoneInput.svelte';

	export let growRun: GrowRun;

	$: recordedConditions = Object.keys(growRun.conditions);
	let timezone: string;
</script>

<section>
	<h2>Environmental conditions</h2>

	{#if Object.keys(recordedConditions).length}
		<TimezoneInput bind:timezone />
		{#each recordedConditions as conditionName (conditionName)}
			<ConditionSection {growRun} {timezone} {conditionName} />
		{/each}
	{:else}
		<p>
			No environmental conditions recorded:
			<Add {growRun} />
		</p>
	{/if}
	<!-- <ConditionSection {growRun} {timezone} conditionName="air-temperature" />
	<ConditionSection {growRun} {timezone} conditionName="water-temperature" />
	<ConditionSection {growRun} {timezone} conditionName="humidity" />
	<ConditionSection {growRun} {timezone} conditionName="water-level" />
	<ConditionSection {growRun} {timezone} conditionName="pH" />
	<ConditionSection {growRun} {timezone} conditionName="average-illuminance-at-netcup" />
	<ConditionSection {growRun} {timezone} conditionName="co2" /> -->
</section>
