<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { getConditionMetadata, type ConditionMeasurement } from '../conditions';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';

	export let conditionName;
	export let conditionMeasurement: ConditionMeasurement;
	export let timezone: string;
	export let onUpdate = (newMeasurement: ConditionMeasurement) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdate(conditionMeasurement)}>
		<p slot="display">
			{prettyFormatDate(conditionMeasurement.dateTime, timezone)}: {conditionMeasurement.value}{getConditionMetadata(
				conditionName
			).units}
		</p>

		<Inputs
			slot="editing"
			{conditionName}
			bind:value={conditionMeasurement.value}
			bind:dateTime={conditionMeasurement.dateTime}
		/>
	</EditTemplate>
</li>
