/* eslint-disable no-console */

import keymirror from 'keymirror';
import * as theme from '../src/client/styles/theme';

global.normalizeTestPaths = (value) =>
	typeof value === 'string' ? value.replace(/\\+/g, '/') : value;

// Get class names from styles function
global.classes = (styles) => keymirror(styles(theme));

jest.mock('react-scripts/config/webpack.config.dev', () => ({ cra: true }), { virtual: true });
jest.mock('webpack-dev-server', function () {
	return function () {
		return {
			app: {},
			startCallback(cb) {
				cb();
			},
			stopCallback(cb) {
				cb();
			},
		};
	};
});
