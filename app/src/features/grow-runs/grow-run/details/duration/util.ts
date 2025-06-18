import { displayFormatForDateTime } from '@grow-run-archive/definitions';

export function formatToUTCISO(localFormat: string | undefined) {
	if (!localFormat) return;
	return new Date(localFormat).toISOString();
}

export function formatToLocalDate(UTCISOformat: string | undefined) {
	if (!UTCISOformat) return;

	const date = new Date(UTCISOformat);

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
		pad(date.getMinutes())
	);
}

export function prettyFormatDate(date: string | undefined, timeZone?: string) {
	if (date === '-' || !date) return undefined;

	return displayFormatForDateTime(date, timeZone);
}

export function getTimeValue(
	dateString: string | undefined,
	timeZone?: string
): number | undefined {
	if (dateString === '-' || !dateString) return undefined;

	const date: Date = new Date(dateString);
	let formatted1 = Intl.DateTimeFormat('en-GB', {
		timeZone,
		timeStyle: 'full'
	}).formatToParts(date);

	const formatted = formatted1.map((part) => part.value);
	const timeValueInTimezone =
		((parseInt(formatted[0]) * 60 + parseInt(formatted[2])) * 60 + parseInt(formatted[4])) * 1000;
	return timeValueInTimezone;
}

// "hh:mm"
export function timeValueToString(timeValueInMS: number) {
	const minutes = Math.round(((timeValueInMS / 3600000) % 1) * 60);
	return `${Math.floor(timeValueInMS / 3600000)}:${minutes < 10 ? '0' + minutes : minutes}`;
}
