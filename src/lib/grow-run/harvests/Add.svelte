<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';

	export let growRun: GrowRun;

	let massLeavesHarvestedInput: number;
	let numLeavesHarvestedInput: number;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordHarvest({
			massOfLeaves: massLeavesHarvestedInput,
			numberOfLeaves: numLeavesHarvestedInput
		});
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<label>
		I harvested <input type="number" bind:value={numLeavesHarvestedInput} /> leaves that weighed in
		at

		<input type="number" bind:value={massLeavesHarvestedInput} />g
	</label>
</AddTemplate>
