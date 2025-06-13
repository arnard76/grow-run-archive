import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3000;

// Use JSON parser middleware
app.use(express.json());

// Use CORS middleware
app.use(cors());

const apiRouter = Router();

apiRouter.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'ok',
		environment: (process.env.ENV ?? 'local').toLowerCase()
	});
});

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StatusCodes } from 'http-status-codes';
import { createWebsocketApplication } from './sockets.js';
const __filename = fileURLToPath(import.meta.url);
fs.readdir(`${path.dirname(__filename)}/features`, (err, files) => {
	files.forEach((file) => {
		try {
			const { url, router } = require('./features/' + file).default;
			apiRouter.use(url, router);
		} catch (e) {
			console.error(
				`Couldn\'t create a router for ${file} because ${e}. If this file is not a router, this message can be safely ignored.`
			);
		}
	});
	apiRouter.get('*', (req: Request, res: Response) => res.sendStatus(StatusCodes.NOT_FOUND));

	app.use(apiRouter);
	console.info('All routes registered');
});

import http from 'http';
const server = http.createServer(app);
createWebsocketApplication(server, app);

server.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
