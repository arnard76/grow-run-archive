export const environmentalConditions = [
	'air-temperature',
	'water-temperature',
	'humidity',
	'water-level',
	'pH',
	'average-illuminance-at-netcup',
	'co2'
] as const satisfies string[];

export type EnvironmentalCondition = (typeof environmentalConditions)[number];

export * from './missingDataNotification/index.js';
