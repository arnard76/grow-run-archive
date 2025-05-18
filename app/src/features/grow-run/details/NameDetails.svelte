<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplateWithInputsReset.svelte';
	import type GrowRun from '$features/grow-run';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import { growRunsAPI } from '../store';
	export let growRun: GrowRun;

	let updatedGrowName: GrowRun['name'];
</script>

<section>
	<EditTemplate
		onUpdate={() => growRunsAPI.updatePartial(growRun.id, { name: updatedGrowName })}
		editText={growRunActionNames.changeName}
		currentValue={growRun.name}
		bind:editedValue={updatedGrowName}
	>
		<h2 slot="display" class="inline-block m-0">
			{growRun.name}
		</h2>

		<label slot="editing" class="inline-block">
			<input placeholder="Enter Grow Run Name" type="text" bind:value={updatedGrowName} />
		</label>
	</EditTemplate>
</section>
