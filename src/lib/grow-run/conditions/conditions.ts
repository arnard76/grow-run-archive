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

export function getConditionMetadata(conditionName: keyof ConditionsMeasurements) {
	if (conditionsMetadata[conditionName]) return conditionsMetadata[conditionName];

	return { units: 'NULLUNITS' };
}

const conditionsMetadata: { [key in string]: any } = {
	humidity: { units: '%' },
	'air-temperature': { units: '°C' },
	'water-temperature': { units: '°C' },
	'water-level': { units: 'mm' }
};

export function toVerbose(conditionName: keyof ConditionsMeasurements) {
	return (conditionName.charAt(0).toUpperCase() + conditionName.slice(1)).replace('-', ' ');
}
