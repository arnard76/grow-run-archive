<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsAPI } from '$lib/grow-run/store';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;

	export let selectedResourceToUse: string | undefined = undefined;
	export let amountUsedInput: number | undefined = undefined;
</script>

<AddTemplate
	onClick={() => {
		if (!amountUsedInput || !selectedResourceToUse) return;

		growRun.addResourceUsage({
			amountUsed: amountUsedInput,
			name: selectedResourceToUse
		});
		growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
	}}
	addText="➕"
>
	<Inputs bind:selectedResourceToUse bind:amountUsedInput />
</AddTemplate>
