<script lang="ts">
	import { growRunsStore } from '$lib/grow-run/stores';

	let showingInputs = false;
	let nameInput = '',
		fromExperimentInput = '';
</script>

{#if showingInputs}
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
	<input type="text" placeholder="part of experiment name" bind:value={fromExperimentInput} />
{/if}
<button
	on:click={() => {
		if (showingInputs) {
			growRunsStore.addGrowRun({ name: nameInput, fromExperiment: fromExperimentInput });
		}
		showingInputs = !showingInputs;
	}}
>
	Add new grow run
</button>
