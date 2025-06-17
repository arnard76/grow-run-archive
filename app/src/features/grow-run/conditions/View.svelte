<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { environmentalConditions } from '@grow-run-archive/definitions';
	import Condition from './condition/View.svelte';
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

	<div class="mt-2">
		{#if Object.keys(growRun.conditions).length}
			{#each environmentalConditions as environmentalConditionName}
				{#if growRun.conditions[environmentalConditionName]}
					<Condition {growRun} {timezone} conditionName={environmentalConditionName} />
				{/if}
			{/each}
		{:else}
			<p>No environmental measurements</p>
		{/if}
	</div>
</section>
