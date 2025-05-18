import { defineConfig } from 'cypress';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// Load environment variables from .env file
const env = config({ path: '../.env' });
expand(env);

console.log({ p: process.env });

export default defineConfig({
	defaultCommandTimeout: 8000,
	video: true,
	chromeWebSecurity: false,
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			config.env = { ...config.env, ...process.env };
			return config;
		}
	}
});
