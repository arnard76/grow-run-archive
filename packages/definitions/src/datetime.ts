export type DateTime = string;

export const displayFormatForDateTime = (date: string, timeZone?: string) =>
	new Intl.DateTimeFormat('en-NZ', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone
	}).format(new Date(date));
