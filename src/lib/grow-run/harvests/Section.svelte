<script lang="ts">
	import { growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	import Add from './Add.svelte';

	export let growRun: GrowRun;

	let massLeavesHarvestedInput: number;
	let numLeavesHarvestedInput: number;
</script>

<h4>Harvests</h4>
{#if growRun.harvests.length}
	<ul>
		{#each growRun.harvests as harvest}
			<li>{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)</li>
		{/each}
		<hr />
		<li class="summary">
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
