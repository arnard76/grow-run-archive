<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import Action from '$features/grow-run/ActionTemplate.svelte';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import { growRunsAPI } from '$features/grow-run/store';

	export let growRun: GrowRun;
	export let closeModal: () => any;
	let updatedGrowRunLocation: GrowRun['location'] = growRun.location;
</script>

<Action
	actionName={growRunActionNames.changeLocation}
	onComplete={() => growRunsAPI.updatePartial(growRun.id, { location: updatedGrowRunLocation })}
	onCancel={closeModal}
>
	<Inputs bind:updatedGrowRunLocation />
</Action>
