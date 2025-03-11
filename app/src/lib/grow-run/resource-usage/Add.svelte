<script lang="ts">
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;

	export let selectedResourceToUse: string | undefined = undefined;
	export let amountUsedInput: number | undefined = undefined;
</script>

<AddTemplate
	onClick={() => {
		if (!amountUsedInput || !selectedResourceToUse) return;

		growRun.addResourceUsage({
			resourceName: selectedResourceToUse,
			amountUsed: amountUsedInput
		});
		growRunsStore.updateGrowRun(growRun);
		amountUsedInput = undefined;
		selectedResourceToUse = undefined;
	}}
	addText="➕"
>
	<Inputs bind:selectedResourceToUse bind:amountUsedInput />
</AddTemplate>
