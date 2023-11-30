<script lang="ts">
	import { growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';

	export let growRun: GrowRun;

	let massLeavesHarvestedInput: number;
	let numLeavesHarvestedInput: number;
</script>

<h4>Harvests</h4>
<div>
	<ul>
		{#each growRun.harvests as harvest}
			<li>{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)</li>
		{/each}
		<hr />
		<li class="summary">
			{growRun.totalMassLeavesHarvested()}g ({growRun.totalNumLeavesHarvested()} leaves)
		</li>
	</ul>

	<div>
		<label>
			I harvested <input type="number" bind:value={numLeavesHarvestedInput} /> leaves that weighed
			in at

			<input type="number" bind:value={massLeavesHarvestedInput} />g
		</label>
		<button
			on:click={() => {
				growRun.recordHarvest({
					massOfLeaves: massLeavesHarvestedInput,
					numberOfLeaves: numLeavesHarvestedInput
				});
				growRunsStore.updateGrowRun(growRun);
			}}
			>Record
		</button>
	</div>
</div>

<style>
	.summary {
		font-weight: bold;
	}
</style>
