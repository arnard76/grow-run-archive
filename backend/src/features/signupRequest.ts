import { mailer } from '@grow-run-archive/mailer-service';

export async function signUpRequestHandler({ 'user-email': userEmail }: { 'user-email': string }) {
	if (!userEmail) throw Error('user email not provided');

	let mainText = `What should happen now? Give ${userEmail} their own GRA!`;
	let message = {
		to: 'growrunarchive@gmail.com',
		from: 'arnard76@gmail.com',
		subject: `Grow Run Archive - ${userEmail} has requested to sign-up!`,
		text: mainText,
		html: `<img src='https://c.tenor.com/rePUPZVv9loAAAAC/tenor.gif'><p>${mainText}</p>`
	};

	const info = await mailer.sendMail(message);
	console.log(JSON.stringify(info));
}

import { EntityController } from '@/entity/controller';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';

class Controller implements EntityController {
	async create(req: Request, res: Response) {
		try {
			await signUpRequestHandler(req.body);
			// validate?
			res.status(StatusCodes.OK).send('Sign up requested');
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(`Something went wrong: ${e}`);
		}
	}
}

const controller = new Controller();
export const signUpRequestRouter = Router();
signUpRequestRouter.post('/', controller.create);
export default { url: '/sign-up-request', router: signUpRequestRouter };
