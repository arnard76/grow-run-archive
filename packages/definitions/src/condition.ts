export const INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES = 2;
export const INTERVAL_FOR_ENVIRONMENTAL_DATA =
	INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES * 60 * 1000; // in ms

export type ConditionMeasurement = {
	dateTime: ExternalConditionsMeasurements['dateTime'];
	value: ExternalConditionsMeasurements['conditions'][''];
};

export type ConditionMeasurements = { [id: string | number]: ConditionMeasurement };

export type ConditionsMeasurements = {
	[conditionName in string]: ConditionMeasurements;
};

export type ExternalConditionsMeasurements = {
	dateTime: string;
	conditions: {
		[conditionName in string]: number;
	};
};

export function getConditionMetadata(conditionName?: keyof ConditionsMeasurements) {
	if (conditionName && conditionsMetadata[conditionName]) return conditionsMetadata[conditionName];

	return { units: 'NULLUNITS' };
}

type ConditionMetadata = { [key in string]: { units: string; verbose?: string } };

export const conditionsMetadata: ConditionMetadata = {
	humidity: { units: '%' },
	'air-temperature': { units: '°C' },
	'water-temperature': { units: '°C' },
	'water-level': { units: 'mm' },
	pH: { units: '', verbose: 'pH' },
	'average-illuminance-at-netcup': { units: 'lux' },
	co2: { units: 'ppm' }
};

export function verboseConditionName(conditionName: keyof ConditionsMeasurements) {
	return getConditionMetadata(conditionName).verbose || conditionName.replaceAll('-', ' ');
}
