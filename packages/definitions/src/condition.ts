export type ConditionMeasurement = { dateTime: string; value: number };

export type ConditionMeasurements = { [id: string | number]: ConditionMeasurement };

export type ConditionsMeasurements = {
	[conditionName in string]: ConditionMeasurements;
};
