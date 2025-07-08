/**
 * Added this so the tsconfig.json aliases/paths would work in the e2e tests 👇👇
 * e.g. @/utils/array or @/commonActions
 *
 * Copied this configuration from this repository: https://github.com/bahmutov/using-ts-aliases-in-cypress-tests/tree/master
 * Related Cypress GitHub Issue: https://github.com/cypress-io/cypress/issues/17788
 */

import wp from '@cypress/webpack-preprocessor';
import path from 'path';

const webpackOptions = {
	resolve: {
		extensions: ['.ts'],
		alias: {
			'@': path.resolve(__dirname, '../e2e/minimiseRegression')
		}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				use: [
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	}
};

const options = {
	webpackOptions
};

export default wp(options);
