<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '../store';
	import Add from './Add.svelte';
	import Harvest from './ListItem.svelte';

	export let growRun: GrowRun;
</script>

<section>
	<h2>Harvests</h2>
	{#if growRun.harvests.length}
		<ul>
			{#each growRun.harvests as harvest, index (harvest.datetime)}
				<Harvest
					{harvest}
					onUpdateHarvest={(updatedHarvest) => {
						growRun.harvests[index] = updatedHarvest;
						growRunsStore.updateGrowRun(growRun);
					}}
				/>
			{/each}
			<hr />
			<li class="total-summary">
				<span style="display:inline-block;width: 300px;">Total</span>
				{growRun.totalMassLeavesHarvested().toFixed(2)}g ({growRun.totalNumLeavesHarvested()} leaves)
			</li>

			<li class="average-summary">
				<span style="display:inline-block;width: 300px;">Average</span>
				{(growRun.totalMassLeavesHarvested() / growRun.totalNumLeavesHarvested()).toFixed(2)}g per
				leaf
			</li>
		</ul>
	{:else}
		<p>Currently, no harvests have been performed AND recorded. Feel free to add below:</p>
	{/if}
	<Add {growRun} />
</section>

<style>
	.total-summary {
		font-weight: bold;
	}
</style>
