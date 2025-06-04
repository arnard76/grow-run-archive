import { EntityController } from '@/entity/controller.js';
import { EntityRepository } from '@/entity/repository.js';
import { database } from '@/services/database/firebase/index.js';
import { db } from '@/services/database/neon-postgresql/index.js';
import dayjs from '@grow-run-archive/dayjs';
import { GrowRun } from '@grow-run-archive/definitions';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fromError } from 'zod-validation-error';
import { MissingEnvironmentDetective as EnvironmentalDataDetective } from './missingGrowRunEnvironment.js';

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

class Controller implements EntityController {
	get = async (req: Request, res: Response) => {
		try {
			const allUsers = database.ref('/');
			const allData = await allUsers.get();
			const currentRunDateTime = dayjs();

			await Promise.all(
				Object.entries(allData.val() || {}).map(async ([userId, userData]: any) => {
					await Promise.all(
						Object.entries(userData['grow-runs'] || {}).map(
							async ([growRunId, growRunAny]: [GrowRun['id'], any]) => {
								try {
									await new EnvironmentalDataDetective(
										userId,
										new GrowRun({ id: growRunId, ...growRunAny }),
										currentRunDateTime
									).detectMissingDataAndNotify();
								} catch (e) {
									// console.error(e);
								}
							}
						)
					);
				})
			);
			await repository.replace({
				lastCheckDataIsMissingDateTime: currentRunDateTime.toISOString()
			});

			res.sendStatus(StatusCodes.OK);
		} catch (e: any) {
			res.status(StatusCodes.BAD_REQUEST);
			res.send(fromError(e).toString());
		}
	};
}

const controller = new Controller();
export const missingEnvironmentNotificationsRouter = Router();
missingEnvironmentNotificationsRouter.get('/', controller.get);

export default {
	url: '/notify-if-missing-environment',
	router: missingEnvironmentNotificationsRouter
};
