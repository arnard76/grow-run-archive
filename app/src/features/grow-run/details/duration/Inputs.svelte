<script lang="ts">
	import { formatToLocalDate, formatToUTCISO } from './util';

	/**have to switch between two formats here
	 * 1. ISO UTC timezone (what times are stored as)
	 * 2. shortened local timezone (for input element)
	 */

	export let startDateInput: string | undefined = undefined,
		endDateInput: string | undefined = undefined;

	let startLocalDateInput = formatToLocalDate(startDateInput),
		endLocalDateInput = formatToLocalDate(endDateInput);

	$: startDateInput = formatToUTCISO(startLocalDateInput);
	$: endDateInput = formatToUTCISO(endLocalDateInput);
</script>

<label>
	Start Date: <input type="datetime-local" bind:value={startLocalDateInput} />
</label>
<label>
	End Date: <input type="datetime-local" bind:value={endLocalDateInput} />
</label>
