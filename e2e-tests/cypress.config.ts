import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
	defaultCommandTimeout: 8000,
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			config.env = { ...config.env, ...process.env };
			return config;
		}
	}
});
