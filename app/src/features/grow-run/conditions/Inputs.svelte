<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$features/grow-run/details/duration/util';
	import {
		getConditionMetadata,
		environmentalConditions,
		verboseConditionName,
		type ConditionsMeasurements
	} from '@grow-run-archive/definitions';

	/**have to switch between two formats here
	 * 1. ISO UTC timezone (what times are stored as)
	 * 2. shortened local timezone (for input element)
	 */
	export let dateTime: string | undefined = undefined,
		value: number;
	export let conditionName: keyof ConditionsMeasurements;

	let localDateTimeInput = formatToLocalDate(dateTime);

	$: if (monitoringRightNow)
		localDateTimeInput = formatToLocalDate(new Date(Date.now()).toISOString());
	$: dateTime = formatToUTCISO(localDateTimeInput);

	let monitoringRightNow = true;
</script>

<div class="horizontal-input-group">
	<select bind:value={conditionName}>
		{#each environmentalConditions as environmentalCondition (environmentalCondition)}
			<option value={environmentalCondition}>{environmentalCondition}</option>
		{/each}
	</select>:
	{#if conditionName}
		<input type="number" bind:value min="-273" max="250" inputmode="numeric" />
		{getConditionMetadata(conditionName).units}

		<pre class={!monitoringRightNow ? 'line-through' : ''}>right now</pre>
		<input type="checkbox" bind:checked={monitoringRightNow} />

		{#if !monitoringRightNow}
			at time:
			<input type="datetime-local" bind:value={localDateTimeInput} />
		{/if}
	{/if}
</div>
