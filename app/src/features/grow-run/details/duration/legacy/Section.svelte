<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplateWithInputsReset.svelte';
	import type GrowRun from '$features/grow-run';
	import { growRunsAPI } from '$features/grow-run/store';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '../util';

	export let growRun: GrowRun;
	let editMode = false;
	$: growRunDuration = growRun.calculateDurationInDays();

	let editGrowRunDurationInputs: NonNullable<GrowRun['duration']>;
</script>

<section>
	<EditTemplate
		bind:editMode
		bind:editedValue={editGrowRunDurationInputs}
		currentValue={growRun.duration || {}}
		onUpdate={() => growRunsAPI.updatePartial(growRun.id, { duration: editGrowRunDurationInputs })}
		editText={growRunActionNames.changeStartAndEnd}
	>
		<p slot="display">
			Ran from <span class="italic">{prettyFormatDate(growRun.duration?.start) || '-'}</span>
			<br />to <span class="italic">{prettyFormatDate(growRun.duration?.end) || '-'}</span>
		</p>
		<Inputs
			slot="editing"
			bind:startDateInput={editGrowRunDurationInputs.start}
			bind:endDateInput={editGrowRunDurationInputs.end}
		/>
	</EditTemplate>
	{#if !editMode && growRunDuration}
		<p class="mt-4">
			Total duration
			<i>
				{growRunDuration.toFixed(2)} days
			</i>
		</p>
	{/if}
</section>
