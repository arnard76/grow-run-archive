import { defineConfig } from 'cypress';

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
