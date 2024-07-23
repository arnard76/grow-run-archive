<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$lib/grow-run/details/duration/util';
	import type { ConditionMeasurement } from '../conditions';

	/**have to switch between two formats here
	 * 1. ISO UTC timezone (what times are stored as)
	 * 2. shortened local timezone (for input element)
	 */
	export let waterLevelRecord: ConditionMeasurement;

	let localDateTimeInput = formatToLocalDate(waterLevelRecord.dateTime);

	$: if (monitoringRightNow)
		localDateTimeInput = formatToLocalDate(new Date(Date.now()).toISOString());
	$: waterLevelRecord.dateTime = formatToUTCISO(localDateTimeInput) as string;

	let monitoringRightNow = true;
</script>

<label>
	Water Level:
	<input type="number" bind:value={waterLevelRecord.value} min="0" inputmode="numeric" />mm
</label>

<label>
	right now <input type="checkbox" bind:checked={monitoringRightNow} />?
</label>

{#if !monitoringRightNow}
	Time:
	<input type="datetime-local" bind:value={localDateTimeInput} />
{/if}

<style>
	input {
		width: 50px;
	}
</style>
