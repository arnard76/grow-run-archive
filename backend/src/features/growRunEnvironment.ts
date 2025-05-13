import { EntityController } from '@/entity/controller';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { type Reference } from 'firebase-admin/database';
import type { ExternalConditionsMeasurements, GrowRun } from '@grow-run-archive/definitions';
import { database } from '@grow-run-archive/firebase-backend-service';
import { getUser } from '@/util/auth';

class Repository {
	async create(
		user: any,
		growRunId: GrowRun['id'],
		dateTime: ExternalConditionsMeasurements['dateTime'],
		environmentalConditions: ExternalConditionsMeasurements['conditions']
	) {
		if (!growRunId)
			throw Error(
				'Grow Run ID was not provided. No idea which grow run has these measured environmental conditions.'
			);

		if (!dateTime)
			throw Error(
				'Datetime was not provided. No idea when this grow run had these environmental conditions.'
			);

		const conditions: Reference = database.ref(`${user.localId}/grow-runs/${growRunId}/conditions`);

		await Promise.all(
			Object.entries(environmentalConditions).map(([conditionName, conditionValue]) =>
				conditions.child(conditionName).push({ dateTime, value: conditionValue })
			)
		);
	}

	// validators = {
	//     create: this.repository.validators.create
	// };
}

const repository = new Repository();

class Controller implements EntityController {
	async create(req: Request, res: Response) {
		const deviceData = await req.body;
		const { dateTime, user, growRunId, ...environmentReadings } = deviceData;

		if (!user || !user.username || !user.password) {
			res.sendStatus(StatusCodes.UNAUTHORIZED);
		}

		const fullUser = await getUser(user.username, user.password);
		if (!fullUser) res.sendStatus(401);

		try {
			await repository.create(fullUser, growRunId, dateTime, environmentReadings);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(`Something went wrong: ${e}`);
		}

		res.status(StatusCodes.CREATED).send('Device data has been recieved');
	}
}

const controller = new Controller();
export const growRunEnvironmentPath = '/grow-run/environment';
export const growRunEnvironmentRouter = Router();
growRunEnvironmentRouter.post('/', controller.create);
export default { url: growRunEnvironmentPath, router: growRunEnvironmentRouter };
