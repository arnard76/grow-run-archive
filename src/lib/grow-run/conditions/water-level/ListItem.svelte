<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { WaterLevelRecord } from './types';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';

	export let waterLevelRecord: WaterLevelRecord;
	export let timezone: string;
	export let onUpdateWaterLevel = (newWaterLevel: WaterLevelRecord) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdateWaterLevel(waterLevelRecord)}>
		<p slot="display" style="display: inline-block;">
			{prettyFormatDate(waterLevelRecord.dateTime, timezone)}: {waterLevelRecord.waterLevel}mm
		</p>

		<Inputs slot="editing" bind:waterLevelRecord />
	</EditTemplate>
</li>
