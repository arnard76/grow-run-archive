import http from 'http';
import { Server } from 'socket.io';
import { Express, Response } from 'express';
import { Resource, ResourceType } from '@grow-run-archive/definitions';
import { database } from './services/database/firebase/index.js';
import { getUser } from './services/database/firebase/auth.js';
import { auth } from 'firebase-admin';

// async function readResources (
//     callback: (res: Response<ResourceType[]>) => void
//   ) {
//   //   const { error } = idSchema.validate(id);

//   //   if (error) {
//   //     return callback({
//   //       error: Errors.ENTITY_NOT_FOUND,
//   //     });
//   //   }

//     try {
//       const todo = await todoRepository.findById(id);
//       callback({
//         data: todo,
//       });
//     } catch (e) {
//       callback({
//       //   error: sanitizeErrorMessage(e),
//       error: e
//       });
//     }
//   },

export function createWebsocketApplication(server: http.Server, app: Express) {
	const io = new Server(server, { cors: { origin: '*' } });
	io.on('connection', (socket) => {
		const token = socket.handshake.auth.token;
		console.log('a user connected', token);
		// const user = auth().getUser(token);
		// if (!user) return;
		// if (!user.) return;
		// authenticate
		// authorise
		database.ref(`/${token}/grow-runs`).on('value', (snapshot) => {
			socket.emit(`grow-runs`, snapshot.toJSON());
		});

		database.ref(`/${token}/resource-list`).on('value', (snapshot) => {
			socket.emit(`resource-list`, snapshot.toJSON());
		});
	});
}
