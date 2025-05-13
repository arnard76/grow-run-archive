import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import errorHandler from '@/middleware/ErrorHandler';
import cors from 'cors';

dotenv.config({ path: ['../.env'] });

const app: Express = express();
const port = process.env.PORT || 3000;

// Use JSON parser middleware
app.use(express.json());

// Use CORS middleware
app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'ok',
		environment: (process.env.ENV ?? 'local').toLowerCase()
	});
});

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';

fs.readdir('./src/features', (err, files) => {
	files.forEach((file) => {
		try {
			const b = require('./features/' + file).default;
			const { url, router } = b;
			app.use(url, router);
		} catch (e) {
			console.error(
				`Couldn\'t create a router for ${file} because ${e}. If this file is not a router, this message can be safely ignored.`
			);
		}
	});
});

// Use Error Handler middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
