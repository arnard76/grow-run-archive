import { NextFunction, Response, Request, Router, RequestHandler } from 'express';
import { EntityFirebaseRepository } from './firebaseRepository.js';
import { DecodedIdToken, getAuth, UserRecord } from 'firebase-admin/auth';
import { StatusCodes } from 'http-status-codes';
import { getUser } from '@/services/database/firebase/auth.js';
import { auth } from 'firebase-admin';

const authenticateAuthorise: any = async (req: any, res: any, next: any) => {
	const authenticationToken = req.header('Authorization');
	if (!authenticationToken) {
		return res.sendStatus(StatusCodes.UNAUTHORIZED);
	}

	let user: UserRecord;
	try {
		// user = await getAuth().verifyIdToken(authenticationToken);
		user = await auth().getUser(authenticationToken);
	} catch (e) {
		return res.sendStatus(StatusCodes.UNAUTHORIZED);
	}

	req.user = user;

	// authorize
	// automatic authorization by using user id in the firebase ref path (lol)
	next();
};

export class EntityFirebaseRouter<Entity> {
	entityIdProperty: keyof Entity;
	entityName: string;
	entityFirebaseRepository: EntityFirebaseRepository<Entity>;

	constructor(entityName: string, entityIdProperty: keyof Entity) {
		this.entityName = entityName;
		this.entityIdProperty = entityIdProperty;
		this.entityFirebaseRepository = new EntityFirebaseRepository(entityName, entityIdProperty);
	}

	/**
	 * @param path - if provided, it should start with a /
	 */
	entityRef(path = '') {
		return `/${this.entityName}${path}`;
	}

	put = async (req: any, res: Response, next: NextFunction) => {
		try {
			// validate entity is correct schema
			// firebase doesn't give a fuck!

			// action
			this.entityFirebaseRepository.replace(req.user.uid, req.body);
			res.sendStatus(StatusCodes.OK);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(e);
		}
	};

	patch = async (req: any, res: Response, next: NextFunction) => {
		try {
			// validate entity is correct schema
			// firebase doesn't give a fuck!

			// action
			this.entityFirebaseRepository.edit(req.user.uid, req.params.entityId, req.body);
			res.sendStatus(StatusCodes.OK);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(e);
		}
	};

	post = async (req: any, res: Response, next: NextFunction) => {
		try {
			console.log('in firebase router, post 1');
			// validate entity is correct schema
			// firebase doesn't give a fuck!

			// action
			await this.entityFirebaseRepository.add(req.user.uid, req.body);
			res.sendStatus(StatusCodes.CREATED);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(e);
		}
	};

	delete = async (req: any, res: Response, next: NextFunction) => {
		try {
			// action
			const resourceId = req.params.entityId;
			await this.entityFirebaseRepository.delete(req.user.uid, resourceId);
			res.sendStatus(StatusCodes.OK);
		} catch (e) {
			res.status(StatusCodes.BAD_REQUEST).send(e);
		}
	};

	get router() {
		const router = Router();
		router.put('/:entityId', authenticateAuthorise, this.put);
		router.patch('/:entityId', authenticateAuthorise, this.patch);
		router.post('/', authenticateAuthorise, this.post);
		router.delete('/:entityId', authenticateAuthorise, this.delete);
		return router;
	}

	exportRouter() {
		return { url: this.entityRef(), router: this.router };
	}
}
