<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';
	import type { ConditionMeasurement } from '../conditions';

	export let waterLevelRecord: ConditionMeasurement;
	export let timezone: string;
	export let onUpdateWaterLevel = (newWaterLevel: ConditionMeasurement) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdateWaterLevel(waterLevelRecord)}>
		<p slot="display" style="display: inline-block;">
			{prettyFormatDate(waterLevelRecord.dateTime, timezone)}: {waterLevelRecord.value}mm
		</p>

		<Inputs slot="editing" bind:waterLevelRecord />
	</EditTemplate>
</li>
