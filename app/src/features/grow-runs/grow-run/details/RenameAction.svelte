<script lang="ts">
	import GrowRun from '$features/grow-runs/grow-run';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { growRunsAPI } from '$features/grow-runs/grow-run/store';
	import { growRunActionNames } from '@grow-run-archive/definitions';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let updatedGrowName: GrowRun['name'] = growRun.name;
</script>

<ActionTemplate
	actionName={growRunActionNames.rename}
	onComplete={() => growRunsAPI.updatePartial(growRun.id, { name: updatedGrowName })}
	onCancel={closeModal}
>
	<label class="inline-block">
		<input placeholder="Enter Grow Run Name" type="text" bind:value={updatedGrowName} />
	</label>
</ActionTemplate>
