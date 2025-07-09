<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import { environmentalConditions } from '@grow-run-archive/definitions';
	import Condition from './condition/View.svelte';
	import TimezoneInput from './TimezoneInput.svelte';

	export let growRun: GrowRun;

	let timezone: string;
</script>

<section>
	<h2>Conditions</h2>

	<div class="mt-2">
		{#if Object.keys(growRun.conditions).length}
			<TimezoneInput bind:timezone />

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
