import {
	getConditionMetadata,
	type ConditionMeasurements,
	type ConditionsMeasurements
} from '@grow-run-archive/definitions';

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

export function getUnitsForConditions(conditionNames: (keyof ConditionsMeasurements)[]) {
	return conditionNames
		.map((name) => getConditionMetadata(name).units)
		.filter((value, index, array) => array.indexOf(value) === index);
}
