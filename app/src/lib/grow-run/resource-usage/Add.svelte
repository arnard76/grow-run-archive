<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsAPI } from '$lib/grow-run/store';
	import type { ResourceUsage } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	let usageOfResource = {} as ResourceUsage;

	function resetInputs() {
		usageOfResource = {} as ResourceUsage;
	}
</script>

<AddTemplate
	onAdd={() => {
		if (!usageOfResource.amountUsed || !usageOfResource.resourceName) return;

		growRun.addResourceUsage(usageOfResource);
		growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
		resetInputs();
	}}
	onCancel={resetInputs}
	addText="Record"
>
	<Inputs bind:usageOfResource />
</AddTemplate>
