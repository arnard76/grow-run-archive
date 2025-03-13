<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsAPI } from '../store';
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
						growRunsAPI.updatePartial(growRun.id, { harvests: growRun.harvests });
					}}
				/>
			{/each}
			<hr />
			<li class="summary">
				<span>Total</span>
				<span>
					{growRun.totalMassLeavesHarvested().toFixed(2)}g ({growRun.totalNumLeavesHarvested()} leaves)
				</span>
			</li>

			<li class="summary">
				<span>Average</span>
				<pre>
					{(growRun.totalMassLeavesHarvested() / growRun.totalNumLeavesHarvested()).toFixed(2)}g per leaf
				</pre>
			</li>
		</ul>
	{:else}
		<p>Currently, no harvests have been performed AND recorded. Feel free to add below:</p>
	{/if}
	<Add {growRun} />
</section>

<style lang="postcss">
	.summary {
		@apply font-bold flex w-full;
	}

	.summary span:first-of-type {
		@apply flex-1;
	}

	.summary span:nth-of-type(2) {
		@apply flex-grow-0;
	}
</style>
