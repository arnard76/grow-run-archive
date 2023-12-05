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

export function prettyFormatDate(date: string | undefined) {
	if (date === '-' || !date) return undefined;

	return new Date(date).toLocaleString();
}

export function getTimeValue(dateString: string | undefined): number | undefined {
	if (dateString === '-' || !dateString) return undefined;

	const date: Date = new Date(dateString);
	const timeValue = ((date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds()) * 1000;
	return timeValue;
}
