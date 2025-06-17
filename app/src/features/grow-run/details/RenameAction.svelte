<script lang="ts">
	import GrowRun from '$features/grow-run';
	import Action from '$features/grow-run/ActionTemplate.svelte';
	import { growRunsAPI } from '$features/grow-run/store';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let updatedGrowName: GrowRun['name'] = growRun.name;
</script>

<Action
	onComplete={() => growRunsAPI.updatePartial(growRun.id, { name: updatedGrowName })}
	onCancel={closeModal}
>
	<label class="inline-block">
		<input placeholder="Enter Grow Run Name" type="text" bind:value={updatedGrowName} />
	</label>
</Action>
