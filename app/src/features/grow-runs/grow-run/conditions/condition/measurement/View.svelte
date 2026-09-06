<script lang="ts">
	import { prettyFormatDate } from '$lib/dateTimeFormatter';
	import { type ConditionMeasurement, getConditionMetadata } from '@grow-run-archive/definitions';

	export let conditionName;
	export let conditionMeasurement: ConditionMeasurement;
	export let timezone: string;
</script>

<li>
	<p>
		{prettyFormatDate(conditionMeasurement.dateTime, timezone)}: {conditionMeasurement.value}{getConditionMetadata(
			conditionName
		).units}
	</p>
</li>
