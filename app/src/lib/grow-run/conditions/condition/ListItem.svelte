<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplateWithInputsReset.svelte';
	import { getConditionMetadata } from '../conditions';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';
	import type { ConditionMeasurement } from '@grow-run-archive/definitions';

	export let conditionName;
	export let conditionMeasurement: ConditionMeasurement;
	export let timezone: string;
	export let onUpdate = (newMeasurement: ConditionMeasurement) => {};

	let editingConditionInputs = structuredClone(conditionMeasurement);
</script>

<li>
	<EditTemplate
		onUpdate={() => onUpdate(editingConditionInputs)}
		currentValue={conditionMeasurement}
		bind:editedValue={editingConditionInputs}
	>
		<p slot="display">
			{prettyFormatDate(conditionMeasurement.dateTime, timezone)}: {conditionMeasurement.value}{getConditionMetadata(
				conditionName
			).units}
		</p>

		<Inputs
			slot="editing"
			{conditionName}
			bind:value={editingConditionInputs.value}
			bind:dateTime={editingConditionInputs.dateTime}
		/>
	</EditTemplate>
</li>
