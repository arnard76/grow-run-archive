import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EntityController } from '@/entity/controller.js';
import { reverseGeocode } from '@/services/location/locationIQ.js';

class Controller implements EntityController {
	async create(req: Request, res: Response) {
		try {
			const { coords } = req.body;
			// validate?
			const geocodeResult = await reverseGeocode(coords.latitude, coords.longitude);
			res.status(StatusCodes.OK).send(geocodeResult);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(`Something went wrong: ${e}`);
		}
	}
}

const controller = new Controller();
export const growRunLocationRouter = Router();
growRunLocationRouter.post('/', controller.create);
export default { url: '/grow-run/location', router: growRunLocationRouter };
