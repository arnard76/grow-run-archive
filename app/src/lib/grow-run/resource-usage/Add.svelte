<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsAPI } from '$lib/grow-run/store';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;

	export let selectedResourceToUse: string | undefined = undefined;
	export let amountUsedInput: number | undefined = undefined;

	function resetInputs() {
		selectedResourceToUse = undefined;
		amountUsedInput = undefined;
	}
</script>

<AddTemplate
	onAdd={() => {
		if (!amountUsedInput || !selectedResourceToUse) return;

		growRun.addResourceUsage({
			resourceName: selectedResourceToUse,
			amountUsed: amountUsedInput
		});
		growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
		resetInputs();
	}}
	onCancel={resetInputs}
	addText="Record"
>
	<Inputs bind:selectedResourceToUse bind:amountUsedInput />
</AddTemplate>
