import { EnvironmentalCondition } from './index.js';

export type ConditionMeasurement = {
	dateTime: ExternalConditionsMeasurements['dateTime'];
	value: ExternalConditionsMeasurements['conditions']['air-temperature'];
};

export type ConditionMeasurements = { [id: string | number]: ConditionMeasurement } | null;

export type ConditionsMeasurements = Partial<Record<EnvironmentalCondition, ConditionMeasurements>>;

export type ExternalConditionsMeasurements = {
	dateTime: string;
	conditions: Partial<Record<EnvironmentalCondition, number>>;
};

export function getConditionMetadata(conditionName?: EnvironmentalCondition) {
	if (conditionName && conditionsMetadata[conditionName]) return conditionsMetadata[conditionName];

	return { units: 'NULLUNITS' };
}

type ConditionMetadata = Partial<
	Record<EnvironmentalCondition, { units: string; verbose?: string }>
>;

// { [key in string]: { units: string; verbose?: string } };

export const conditionsMetadata: ConditionMetadata = {
	humidity: { units: '%' },
	'air-temperature': { units: '°C' },
	'water-temperature': { units: '°C' },
	'water-level': { units: 'mm' },
	pH: { units: '', verbose: 'pH' },
	'average-illuminance-at-netcup': { units: 'lux' },
	co2: { units: 'ppm' }
};

export function verboseConditionName(conditionName: EnvironmentalCondition) {
	return getConditionMetadata(conditionName).verbose || conditionName.replaceAll('-', ' ');
}
