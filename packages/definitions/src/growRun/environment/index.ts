import { GrowRun } from '../index.js';
import { ConditionMeasurement, INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES } from './condition.js';

/**
 * Returns formatted string
 * lastRecordingTime=null means there has never been a recording
 */
export const missingEnvironmentNotification = (
	growRunName: GrowRun['name'],
	growRunId: GrowRun['id'],
	growRunStartTime: NonNullable<NonNullable<GrowRun['duration']>['start']>,
	lastRecordingTime: ConditionMeasurement['dateTime'] | null
) => {
	return `Losing environmental data - not being recorded!
- Grow Run: ${growRunName} (${growRunId})
- Air temperature is not being recorded
- The last recording was: ${lastRecordingTime}
- Duration missing: ${INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES} minutes (1 environmental record)
JSON:
{"missingData":{"air-temperature":{"lastRecordingDateTime":"${lastRecordingTime}","growRunStartTime":"${growRunStartTime}"}}}
`
		.replace(/\s{2,}/g, ' ')
		.trim();
};
