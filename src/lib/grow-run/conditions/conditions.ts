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
export function formatData(conditionMeasurements: ConditionMeasurements) {
	const tempRecords = Object.values(conditionMeasurements);
	return tempRecords
		.map(({ dateTime, value }) => ({
			x: new Date(dateTime).valueOf(),
			y: value
		}))
		.sort(({ x: t1 }, { x: t2 }) => t1 - t2);
}
