export type ConditionMeasurement = { dateTime: string; value: number };

export type ConditionMeasurements = { [id: string | number]: ConditionMeasurement };

type ConditionsMeasurements = {
	[conditionName in string]: ConditionMeasurements;
};

export type { ConditionsMeasurements as default };

/**
 *
 * @returns data in a format suitable for Charts
 */
export function formatMeasurementsData(conditionMeasurements: ConditionMeasurements) {
	const tempRecords = Object.values(conditionMeasurements);
	return tempRecords
		.map(({ dateTime, value }) => ({
			x: new Date(dateTime).valueOf(),
			y: value
		}))
		.sort(({ x: t1 }, { x: t2 }) => t1 - t2);
}

export function getConditionMetadata(conditionName?: keyof ConditionsMeasurements) {
	if (conditionName && conditionsMetadata[conditionName]) return conditionsMetadata[conditionName];

	return { units: 'NULLUNITS' };
}

type ConditionMetadata = { [key in string]: { units: string; verbose?: string } };

const conditionsMetadata: ConditionMetadata = {
	humidity: { units: '%' },
	'air-temperature': { units: '°C' },
	'water-temperature': { units: '°C' },
	'water-level': { units: 'mm' },
	pH: { units: '', verbose: 'pH' },
	illuminance: { units: 'lux' }
};

export function toVerbose(conditionName: keyof ConditionsMeasurements) {
	return getConditionMetadata(conditionName).verbose || conditionName.replace('-', ' ');
}

export function getUnitsForConditions(conditionNames: (keyof ConditionsMeasurements)[]) {
	return conditionNames
		.map((name) => getConditionMetadata(name).units)
		.filter((value, index, array) => array.indexOf(value) === index);
}
