<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '../store';
	import Add from './Add.svelte';
	import Harvest from './ListItem.svelte';

	export let growRun: GrowRun;
</script>

<h4>Harvests</h4>
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
		<li class="summary">
			<span style="display:inline-block;width: 300px;"></span>
			{growRun.totalMassLeavesHarvested()}g ({growRun.totalNumLeavesHarvested()} leaves)
		</li>
	</ul>
{:else}
	<p>Currently, no harvests have been performed AND recorded. Feel free to add below:</p>
{/if}
<Add {growRun} />

<style>
	.summary {
		font-weight: bold;
	}
</style>
