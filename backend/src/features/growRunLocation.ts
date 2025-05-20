import type { Coords } from '@grow-run-archive/definitions';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EntityController } from '@/entity/controller.js';

export async function reverseGeocode(latitude: Coords['latitude'], longitude: Coords['longitude']) {
	const locationIQAPIUrl =
		`https://us1.locationiq.com/v1/reverse?` +
		new URLSearchParams({
			lat: latitude.toString(),
			lon: longitude.toString(),
			format: 'json',
			key: process.env.SECRET_LOCATION_IQ_API_KEY as string
		});

	return await (await fetch(locationIQAPIUrl)).json();
}

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
