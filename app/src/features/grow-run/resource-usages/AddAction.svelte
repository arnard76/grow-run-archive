<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$features/grow-run';
	import { growRunsAPI } from '$features/grow-run/store';
	import { growRunActionNames, type ResourceUsage } from '@grow-run-archive/definitions';
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
	addText={growRunActionNames.useResource}
	expanded={true}
>
	<Inputs bind:usageOfResource />
</AddTemplate>
