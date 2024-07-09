<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '$lib/grow-run/store';
	import Add from './Add.svelte';
	import WaterLevel from './ListItem.svelte';
	import Graph from './FullPeriodLineGraph.svelte';

	export let growRun: GrowRun;
	export let timezone: string;

	$: anyRecords = growRun.conditions['water-level']?.length;
</script>

<section style="display: flex;">
	<div style={anyRecords ? 'max-width: 50%;' : ''}>
		<h3>Water level</h3>

		{#if anyRecords}
			<ul>
				{#each growRun.conditions['water-level'] || [] as waterLevelRecord (waterLevelRecord.dateTime)}
					<WaterLevel
						{waterLevelRecord}
						{timezone}
						onUpdateWaterLevel={(waterLevelRecord) => {
							growRunsStore.updateGrowRun(growRun);
						}}
					/>
				{/each}
				<hr />
				<!-- <li class="summary">
		</li> -->
			</ul>
		{:else}
			<p>
				Currently, no water-level temperatures have been measured AND recorded. Feel free to add
				below:
			</p>
		{/if}
		<Add {growRun} />
	</div>
	{#if anyRecords}
		<div style="flex: 1;">
			<Graph {growRun} {timezone} />
		</div>
	{/if}
</section>

<style>
	/* .summary {
		font-weight: bold;
	} */
</style>
