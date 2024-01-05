<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$lib/grow-run/details/duration/util';

	/**have to switch between two formats here
	 * 1. ISO UTC timezone (what times are stored as)
	 * 2. shortened local timezone (for input element)
	 */
	export let dateTime: string | undefined = undefined,
		temperature: number;

	let localDateTimeInput = formatToLocalDate(dateTime);

	$: if (monitoringRightNow)
		localDateTimeInput = formatToLocalDate(new Date(Date.now()).toISOString());
	$: dateTime = formatToUTCISO(localDateTimeInput);

	let monitoringRightNow = true;
</script>

<label>
	Temperature:
	<input type="number" bind:value={temperature} min="-273" max="250" inputmode="numeric" />°C
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
