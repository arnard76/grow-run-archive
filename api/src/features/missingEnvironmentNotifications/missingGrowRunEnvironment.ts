import { EntityRepository } from '@/entity/repository.js';
import { db } from '@/services/database/neon-postgresql/index.js';
import { mailer } from '@/services/mailer/index.js';
import dayjs from '@grow-run-archive/dayjs';
import {
	DateTime,
	GrowRun,
	GrowRunType,
	MissingEnvironmentData,
	NotificationFormat,
	NotificationInformation,
	NotificationRequirements
} from '@grow-run-archive/definitions';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { getAuth } from 'firebase-admin/auth';
import { XOR } from 'ts-xor';

export const databaseTable = pgTable('missing_environment_data_notifications', {
	lastCheckDataIsMissingDateTime: timestamp('last_check_data_is_missing', {
		mode: 'string',
		withTimezone: true
	}).notNull()
});

class Repository {
	table = databaseTable;
	private repository = new EntityRepository(this.table);
	replace = this.repository.replace;
	async get() {
		return (await db.select().from(this.table))[0];
	}
	validators = {
		replace: this.repository.validators.replace
	};
}

type ActiveGrowRun = GrowRun & { duration: { start: DateTime; end?: DateTime } };
type NotifyThresholdInfo = XOR<
	{ needToNotify: true; thresholdPassed: string },
	{ needToNotify: false }
>;

/**
 * Detects if any environmental data is missing for a grow run
 */
export class MissingEnvironmentDetective {
	growRun: ActiveGrowRun;
	currentRunDateTime: dayjs.Dayjs;
	repository = new Repository();
	notificationRequirements = new NotificationRequirements(process.env.PUBLIC_ENV);
	userId: string;

	constructor(userId: string, unknownGrowRun: GrowRun, currentRunDateTime: dayjs.Dayjs) {
		this.userId = userId;

		if (!unknownGrowRun.duration?.start || !unknownGrowRun.active)
			throw Error(
				'This grow run is not active not doing any detective work to check for missing data'
			);

		this.growRun = unknownGrowRun as ActiveGrowRun;
		console.log(this.growRun.name);
		this.currentRunDateTime = currentRunDateTime;
	}

	async detectMissingDataAndNotify() {
		let missingData = this.detectMissingData();
		if (!missingData) return;
		console.info(`${this.growRun.name} isn't recording environment: ${Object.keys(missingData)}`);

		const { needToNotify, thresholdPassed } = await this.qualifiesForNotification(missingData);
		if (needToNotify) console.info(`notifying for ${this.growRun.name}: passed ${thresholdPassed}`);
		if (needToNotify) this.notifyUser(this.summariseMissingData(missingData));
	}

	summariseMissingData(missingData: MissingEnvironmentData): NotificationInformation {
		// - which conditions are missing data? (part of missing data)
		// - which conditions are missing the most data? how many recordings were missed?
		// - what duration of data is missing for each condition? derived
		// - how many recordings were missed? derived
		const growRunStart = this.growRun.duration.start;

		const missingDataWithNumRecordingsLost = Object.fromEntries(
			Object.entries(missingData).map(([conditionName, { lastRecordingDateTime }]) => {
				return [
					conditionName,
					{
						lastRecordingDateTime,
						numRecordingsMissed: this.calculateNumOfMissingRecordings(
							lastRecordingDateTime || growRunStart
						)
					}
				];
			})
		);

		return missingDataWithNumRecordingsLost;
	}

	get currentInterval() {
		return this.currentRunDateTime.subtract(
			this.notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL
		);
	}

	isTimeInCurrentInterval(datetime: DateTime | dayjs.Dayjs) {
		return dayjs(datetime).isAfter(this.currentInterval);
	}

	detectMissingData(): MissingEnvironmentData | undefined {
		const growRunStartTimeInInterval = this.isTimeInCurrentInterval(this.growRun.duration.start);
		if (growRunStartTimeInInterval) return;

		if (!this.growRun.conditions) {
			return Object.fromEntries(
				this.notificationRequirements.monitoredConditions.map((conditionName) => [
					conditionName,
					{ lastRecordingDateTime: null }
				])
			);
		}

		let missingData: MissingEnvironmentData = {};

		this.notificationRequirements.monitoredConditions.forEach((conditionName) => {
			let conditionMeasurements = this.growRun.conditions[conditionName];

			if (!conditionMeasurements) {
				missingData[conditionName] = { lastRecordingDateTime: null };
				return;
			}

			const recordingsInInterval = Object.values(conditionMeasurements).filter((measurement) =>
				this.isTimeInCurrentInterval(measurement.dateTime)
			);

			if (recordingsInInterval.length) return;

			const recordingsSorted = Object.values(conditionMeasurements);
			recordingsSorted.sort((a, b) => dayjs(b.dateTime).diff(a.dateTime));

			let lastRecordingDateTime = recordingsSorted[0].dateTime;
			missingData[conditionName] = { lastRecordingDateTime };
		});

		return Object.keys(missingData).length ? missingData : undefined;
	}

	calculateNumOfMissingRecordings(fromTime: DateTime) {
		return Math.floor(
			this.currentRunDateTime.diff(fromTime) /
				this.notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL
		);
	}

	/**
	 * If data is still missing and it has been 15 minutes, 3 hours, 2 days, 1 week or 1 month, then we can send a notification
	 */
	async qualifiesForNotification(
		missingData: MissingEnvironmentData
	): Promise<NotifyThresholdInfo> {
		const lastRun = (await this.repository.get()).lastCheckDataIsMissingDateTime;

		const growRunStart = this.growRun.duration.start;
		const missingConditionsSorted = Object.values(missingData).toSorted((c1, c2) =>
			dayjs(c1.lastRecordingDateTime || growRunStart).diff(c2.lastRecordingDateTime || growRunStart)
		);

		let referencePoint = missingConditionsSorted[0].lastRecordingDateTime || growRunStart;
		if (
			missingConditionsSorted[0].lastRecordingDateTime &&
			dayjs(missingConditionsSorted[0].lastRecordingDateTime).isBefore(growRunStart)
		) {
			referencePoint = growRunStart;
		}

		const startedMissingDataTimestamp = dayjs(referencePoint);

		for (const [value, unit] of this.notificationRequirements.thresholds) {
			const passed = this.thresholdPassedWithoutNotification(
				startedMissingDataTimestamp.add(value, unit),
				lastRun
			);
			if (!passed && startedMissingDataTimestamp.add(value, unit).isAfter(this.currentRunDateTime))
				console.log(value, unit);
			if (passed) return { needToNotify: true, thresholdPassed: `${value} ${unit}` };
		}

		return { needToNotify: false };
	}

	thresholdPassedWithoutNotification(threshold: dayjs.Dayjs, lastRun: string) {
		return threshold.isBefore(this.currentRunDateTime) && threshold.isAfter(lastRun);
	}

	async notifyUser(notificationInformation: NotificationInformation) {
		console.info(`${this.userId}/${this.growRun.name} notify about missing environment`);
		const user = await getAuth().getUser(this.userId);
		if (!user || !user.email) return;

		const notificationFormat = new NotificationFormat(this.notificationRequirements);

		const subject = notificationFormat.messageSubject(this.growRun.name, this.growRun.id);
		const messageContents = notificationFormat.messageContents(
			this.growRun.name,
			this.growRun.id,
			this.growRun.duration!.start!,
			notificationInformation
		);

		const messageContentsHTML = messageContents;

		let message = {
			to: user.email,
			from: 'growrunarchive@gmail.com',
			subject,
			text: messageContents,
			html: messageContentsHTML
		};

		const info = await mailer.sendMail(message);
		console.log(JSON.stringify(info));
	}
}
