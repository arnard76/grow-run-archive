import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { EntityRepository } from '@/entity/repository.js';

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
const repository = new Repository();

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EntityController } from '@/entity/controller.js';
import { Router } from 'express';
import { fromError } from 'zod-validation-error';
import { database } from '@/services/database/firebase/index.js';
import {
	INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES,
	type ConditionsMeasurements,
	type DateTime,
	type GrowRun
} from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import { mailer } from '@/services/mailer/index.js';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/services/database/neon-postgresql/index.js';
import { growRunEnvironment } from '@grow-run-archive/definitions';

class Controller implements EntityController {
	get = async (req: Request, res: Response) => {
		try {
			const allUsers = database.ref('/');
			const allData = await allUsers.get();

			await Promise.all(
				Object.entries(allData.val() || {}).map(async ([userId, userData]: any) => {
					let missingDataForUser: undefined | MissingData = undefined;

					await Promise.all(
						Object.entries(userData['grow-runs'] || {}).map(
							async ([growRunId, growRunAny]: [GrowRun['id'], any]) => {
								const growRun: GrowRun = { id: growRunId, ...growRunAny };
								const growRunStartTime = growRun.duration?.start;
								// filter to active ones (start date in past, end date undefined or in future)
								if (
									!growRunStartTime || // GR hasn't started
									dayjs(growRunStartTime).isAfter() || // GR hasn't started
									(growRun.duration?.end && dayjs(growRun.duration.end).isBefore()) // GR has ended
								)
									return;

								// which conditions are being monitored?
								// TODO: mechanism to exclude or include certain conditions to reduce annoying notifications
								// GOAL: ALL environmental conditions should be recorded!
								const monitoredConditions = ['air-temperature'];
								const conditions = growRun.conditions;
								if (!conditions) {
									missingDataForUser = Object.fromEntries(
										monitoredConditions.map((conditionName) => [
											conditionName,
											{ lastRecordingDateTime: null, growRunStartTime }
										])
									);
								} else {
									// for each condition:
									monitoredConditions.forEach((conditionName) => {
										let conditionMeasurements = conditions[conditionName];

										// check for each of these conditions there is a recorded value in the last 15 minutes
										const conditionIsBeingRecorded = !!Object.values(
											conditionMeasurements || {}
										).find((measurement) =>
											dayjs(measurement.dateTime).isAfter(
												dayjs().subtract(INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES, 'minutes')
											)
										);

										if (conditionIsBeingRecorded) return;

										// find most recent recording for condition
										const recordingsSorted = Object.values(conditionMeasurements);
										recordingsSorted.sort((a, b) => dayjs(a.dateTime).diff(b.dateTime));

										const lastRecordingDateTime = recordingsSorted.length
											? recordingsSorted[0].dateTime
											: null;

										if (!missingDataForUser) missingDataForUser = {};
										missingDataForUser[conditionName] = {
											lastRecordingDateTime,
											growRunStartTime
										};
									});
								}

								if (!missingDataForUser) return;

								// if condition has just stopped recording then send email, otherwise send a reply to the previous notification
								const user = await getAuth().getUser(userId);
								if (!user || !user.email) return;
								const needToNotify =
									await missingDataDurationQualifiesForNotification(missingDataForUser);
								if (needToNotify) {
									// let numRecordingsMissed =
									sendNotificationForMissingData(
										user.email,
										missingDataForUser,
										{ timeMissed: needToNotify, recordingsMissed: 0 },
										growRun
									);
								}
							}
						)
					);
				})
			);
			setLastRun(dayjs().toISOString());
			res.sendStatus(StatusCodes.OK);
		} catch (e: any) {
			res.status(StatusCodes.BAD_REQUEST);
			res.send(fromError(e).toString());
		}
	};
}

async function getLastRun() {
	return (await repository.get()).lastCheckDataIsMissingDateTime;
}

async function setLastRun(lastCheckDataIsMissingDateTime: string) {
	const parsed = repository.validators.replace.parse({ lastCheckDataIsMissingDateTime });
	await repository.replace(parsed);
}

/**
 * If data is still missing and it has been 15 minutes, 3 hours, 2 days, 1 week or 1 month, then we can send a notification
 */
async function missingDataDurationQualifiesForNotification(
	missingData: MissingData
): Promise<string | undefined> {
	const lastRun = await getLastRun();
	function thresholdPassedWithoutNotification(threshold: dayjs.Dayjs) {
		return threshold.isBefore(dayjs()) && threshold.isAfter(lastRun);
	}

	const missingConditionsSorted = Object.values(missingData);
	missingConditionsSorted.sort(
		({ lastRecordingDateTime }, { lastRecordingDateTime: lastRecordingDateTime2 }) =>
			lastRecordingDateTime && lastRecordingDateTime2
				? dayjs(lastRecordingDateTime).diff(lastRecordingDateTime2)
				: -1
	);
	if (
		!missingConditionsSorted[0].lastRecordingDateTime &&
		!missingConditionsSorted[0].growRunStartTime
	)
		throw Error("Both can't be null");
	const startedMissingDataAtThisTimestamp = dayjs(
		missingConditionsSorted[0].lastRecordingDateTime || missingConditionsSorted[0].growRunStartTime
	);

	const thresholds: [number, dayjs.ManipulateType][] = [
		[INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES, 'minutes'],
		[3, 'hours'],
		[2, 'days'],
		[1, 'week'],
		[1, 'month']
	];

	for (const [value, unit] of thresholds) {
		const passed = thresholdPassedWithoutNotification(
			startedMissingDataAtThisTimestamp.add(value, unit)
		);
		if (passed) return `${value} ${unit}`;
	}
}

type MissingData = {
	[key: keyof ConditionsMeasurements]: {
		lastRecordingDateTime: DateTime | null;
		growRunStartTime: DateTime | null;
	};
};

async function sendNotificationForMissingData(
	userEmail: string,
	missingData: MissingData,
	amountMissed: {},
	growRun: GrowRun
) {
	const mainText = growRunEnvironment
		.missingEnvironmentNotification(
			growRun.name,
			growRun.id,
			growRun.duration!.start!,
			missingData['air-temperature'].lastRecordingDateTime
		)
		.split('\n');

	let message = {
		to: userEmail,
		from: 'growrunarchive@gmail.com',
		subject: `Losing environmental data - not being recorded`,
		text: mainText.join('\n'),
		html: `
            <img src='https://static.vecteezy.com/system/resources/thumbnails/045/888/005/small_2x/mysterious-dark-tunnel-entrance-with-mossy-walls-leading-into-the-unknown-evoking-a-sense-of-adventure-and-exploration-video.jpg'>
            <br>
            <br>
            <p>${mainText.join('<br>')}</p>
        `
	};
	const info = await mailer.sendMail(message);
	console.log(JSON.stringify(info));
}

const controller = new Controller();
export const missingEnvironmentNotificationsRouter = Router();
missingEnvironmentNotificationsRouter.get('/', controller.get);

export default {
	url: '/notify-if-missing-environment',
	router: missingEnvironmentNotificationsRouter
};
