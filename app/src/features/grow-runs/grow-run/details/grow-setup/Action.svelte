<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import { growRunsAPI } from '$features/grow-runs/grow-run/store';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let updatedGrowSetup: GrowRun['growSetup'] = growRun.growSetup;
</script>

<ActionTemplate
	actionName={growRunActionNames.changeGrowSetup}
	onComplete={() => growRunsAPI.updatePartial(growRun.id, { growSetup: updatedGrowSetup })}
	onCancel={closeModal}
>
	<Inputs bind:updatedGrowSetup />
</ActionTemplate>
