<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/stores';

	let nameInput = '',
		fromExperimentInput = '';
</script>

<AddTemplate
	addText="Add grow run"
	onClick={() => growRunsStore.addGrowRun({ name: nameInput, fromExperiment: fromExperimentInput })}
>
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
	<input type="text" placeholder="part of experiment name" bind:value={fromExperimentInput} />
</AddTemplate>
