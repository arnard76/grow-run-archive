<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '$lib/grow-run/store';
	import Add from './Add.svelte';
	import Temperature from './ListItem.svelte';

	export let growRun: GrowRun;
	export let timezone: string;
	export let medium: 'air-temperature' | 'water-temperature';
	$: mediumShortened = medium.split('-')[0];
</script>

{#if medium && growRun.conditions[medium]?.length}
	<ul>
		{#each growRun.conditions[medium] || [] as temperature, index (temperature.dateTime)}
			<Temperature
				temperatureObj={temperature}
				{timezone}
				onUpdateTemperature={(temperatureObj) => {
					growRunsStore.updateGrowRun(growRun);
				}}
			/>
		{/each}
		<hr />
		<li class="summary">
			Average: {growRun.calculateAverageTemperature(medium)?.toFixed(2)}°C
		</li>
	</ul>
{:else}
	<p>
		Currently, no {mediumShortened} temperatures have been measured AND recorded. Feel free to add below:
	</p>
{/if}
<Add {growRun} {medium} />

<style>
	.summary {
		font-weight: bold;
	}
</style>
