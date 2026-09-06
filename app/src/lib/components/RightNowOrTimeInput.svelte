<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from '$lib/dateTimeFormatter';
	import dayjs from '@grow-run-archive/dayjs';
	import type { DateTime } from '@grow-run-archive/definitions';

	export let dateTime: DateTime;

	let localDateTimeInput = formatToLocalDate(dateTime);

	$: if (rightNow) updateLocalDateTime();
	$: dateTime = formatToUTCISO(localDateTimeInput)!;

	let rightNow = true;

	function updateLocalDateTime() {
		localDateTimeInput = formatToLocalDate(dayjs().toISOString());
	}

	setInterval(() => {
		if (rightNow) updateLocalDateTime();
	}, 60_000);
</script>

<pre class={!rightNow ? 'line-through' : ''}>right now</pre>
<input type="checkbox" bind:checked={rightNow} />

{#if !rightNow}
	at time:
	<input type="datetime-local" bind:value={localDateTimeInput} />
{/if}
