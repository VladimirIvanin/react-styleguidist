import { Configuration } from 'webpack-dev-server';

export default function isDevServerHttps(devServer?: Partial<Configuration>): boolean {
	const server = devServer?.server;
	return (
		server === 'https' ||
		server === 'spdy' ||
		(typeof server === 'object' &&
			server !== null &&
			(server.type === 'https' || server.type === 'spdy'))
	);
}
