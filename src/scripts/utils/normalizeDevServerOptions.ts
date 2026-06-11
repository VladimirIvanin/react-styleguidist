import { Configuration } from 'webpack-dev-server';

type LegacyDevServerOptions = Partial<Configuration> & {
	https?: boolean | Record<string, unknown>;
	http2?: boolean | Record<string, unknown>;
};

/**
 * Normalize legacy webpack-dev-server v4 options for v5 compatibility.
 */
export default function normalizeDevServerOptions(
	devServer: LegacyDevServerOptions = {}
): Partial<Configuration> {
	const normalized: LegacyDevServerOptions = { ...devServer };

	if ('https' in normalized) {
		const https = normalized.https;
		if (https === true) {
			normalized.server = { type: 'https' };
		} else if (https && typeof https === 'object') {
			normalized.server = { type: 'https', options: https };
		}
		delete normalized.https;
	}

	if ('http2' in normalized && normalized.http2) {
		const http2 = normalized.http2;
		if (http2 === true) {
			normalized.server = { type: 'spdy' };
		} else if (http2 && typeof http2 === 'object') {
			normalized.server = { type: 'spdy', options: http2 };
		}
		delete normalized.http2;
	}

	if (normalized.proxy && !Array.isArray(normalized.proxy)) {
		normalized.proxy = Object.entries(
			normalized.proxy as Record<string, Record<string, unknown>>
		).map(([context, proxyConfig]) => ({
			context: [context],
			...proxyConfig,
		}));
	}

	return normalized;
}
