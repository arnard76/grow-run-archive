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

<section class="flex flex-wrap">
	<div>
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
		<div>
			<h6>Water level readings throughout grow run</h6>
			<Graph {growRun} {timezone} />
		</div>
	{/if}
</section>
