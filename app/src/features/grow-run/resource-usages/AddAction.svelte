<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { growRunsAPI } from '$features/grow-run/store';
	import { growRunActionNames, type ResourceUsage } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;
	let usageOfResource = {} as ResourceUsage;

	function resetInputs() {
		usageOfResource = {} as ResourceUsage;
	}
</script>

<ActionTemplate
	actionName={growRunActionNames.useResource}
	onCancel={closeModal}
	onComplete={() => {
		if (!usageOfResource.amountUsed || !usageOfResource.resourceName) return;

		growRun.addResourceUsage(usageOfResource);
		growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
		resetInputs();
	}}
>
	<Inputs bind:usageOfResource />
</ActionTemplate>
