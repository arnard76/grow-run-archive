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
		{#each Object.entries(growRun.conditions[medium] || {}) as [_, temperature] (temperature.dateTime)}
			<Temperature
				temperatureObj={temperature}
				{timezone}
				onUpdateTemperature={(temperatureObj) => {
					growRunsStore.updateGrowRun(growRun);
				}}
			/>
		{/each}
	</ul>
{:else}
	<p>
		Currently, no {mediumShortened} temperatures have been measured AND recorded. Feel free to add below:
	</p>
{/if}
<Add {growRun} {medium} />
