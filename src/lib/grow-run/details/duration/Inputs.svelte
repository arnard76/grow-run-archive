<script lang="ts">
	/**have to switch between two formats here
	 * 1. ISO UTC timezone (what times are stored as)
	 * 2. shortened local timezone (for input element)
	 */

	export let startDateInput: string | undefined = undefined,
		endDateInput: string | undefined = undefined;

	let startLocalDateInput: string | undefined =
			startDateInput && formatToLocalDate(new Date(startDateInput)),
		endLocalDateInput: string | undefined =
			endDateInput && formatToLocalDate(new Date(endDateInput));

	$: startDateInput = startLocalDateInput && new Date(startLocalDateInput).toISOString();
	$: endDateInput = endLocalDateInput && new Date(endLocalDateInput).toISOString();

	function formatToLocalDate(date: Date) {
		const localIsoFormattedDate = toIsoString(date);
		const subLength = ':00+05:30'.length;
		const formattedDate = localIsoFormattedDate.substring(
			0,
			localIsoFormattedDate.length - subLength
		);
		return formattedDate;
	}

	function toIsoString(date: Date) {
		var tzo = -date.getTimezoneOffset(),
			dif = tzo >= 0 ? '+' : '-',
			pad = function (num: number) {
				return (num < 10 ? '0' : '') + num;
			};

		return (
			date.getFullYear() +
			'-' +
			pad(date.getMonth() + 1) +
			'-' +
			pad(date.getDate()) +
			'T' +
			pad(date.getHours()) +
			':' +
			pad(date.getMinutes()) +
			':' +
			pad(date.getSeconds()) +
			dif +
			pad(Math.floor(Math.abs(tzo) / 60)) +
			':' +
			pad(Math.abs(tzo) % 60)
		);
	}
</script>

<label>
	Start Date: <input type="datetime-local" bind:value={startLocalDateInput} />
</label><br />
<label>
	End Date: <input type="datetime-local" bind:value={endLocalDateInput} />
</label><br />
