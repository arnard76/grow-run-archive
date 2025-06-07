import { ConditionMeasurement, ConditionsMeasurements } from '../condition.js';
import dayjs from '@grow-run-archive/dayjs';
import { environmentalConditions } from '../index.js';

export type MissingEnvironmentData = Partial<
	Record<
		keyof ConditionsMeasurements,
		{
			lastRecordingDateTime: ConditionMeasurement['dateTime'] | null;
		}
	>
>;

export type NotificationInformation = MissingEnvironmentData &
	Partial<
		Record<
			keyof ConditionsMeasurements,
			{
				numRecordingsMissed: number;
			}
		>
	>;

export class NotificationRequirements {
	multiplier: number;
	ENVIRONMENTAL_DATA_INTERVAL_IN_MINUTES: number;
	ENVIRONMENTAL_DATA_INTERVAL: number;

	constructor(ENV?: string) {
		this.multiplier = ENV === 'test' ? 1 / 60 : 1;
		this.ENVIRONMENTAL_DATA_INTERVAL_IN_MINUTES = this.multiplier * 15;
		this.ENVIRONMENTAL_DATA_INTERVAL = this.ENVIRONMENTAL_DATA_INTERVAL_IN_MINUTES * 60 * 1000; // in ms
	}

	get thresholds() {
		const thresholds: [number, dayjs.ManipulateType][] = [
			[this.ENVIRONMENTAL_DATA_INTERVAL, 'milliseconds'],
			[3, 'hours'],
			[2, 'days'],
			[1, 'week'],
			[1, 'month']
		];

		thresholds.forEach(([value, units], index) => {
			if (index === 0) return;

			let multipliedValue = dayjs.duration(value, units).asMilliseconds() * this.multiplier;
			thresholds[index] = [multipliedValue, 'milliseconds'];
		});
		return thresholds;
	}

	get thresholdsInMS() {
		return this.thresholds.map(([value, unit]) => dayjs.duration(value, unit).asMilliseconds());
	}

	get monitoredConditions(): string[] {
		const monitoredConditions: (typeof environmentalConditions)[number][] = [
			'air-temperature',
			'water-temperature',
			'co2',
			'humidity'
		];
		return monitoredConditions;
	}
}
