import z from 'zod';

export const DateTimeSchema = z.string();

export type DateTime = z.infer<typeof DateTimeSchema>;

export const displayFormatForDateTime = (date: string, timeZone?: string) =>
	new Intl.DateTimeFormat('en-NZ', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone
	}).format(new Date(date));
