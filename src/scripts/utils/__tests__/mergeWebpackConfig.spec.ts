import mergeWebpackConfig from '../mergeWebpackConfig';

class TerserPlugin {
	public apply() {}
}
class MyPlugin {
	public apply() {}
}
class MiniHtmlWebpackPlugin {
	public apply() {}
}

it('should merge two objects', () => {
	const result = mergeWebpackConfig(
		{ entry: 'main.js', devtool: 'cheap-source-map' },
		{ devtool: 'inline-source-map' }
	);
	expect(result).toEqual({ entry: 'main.js', devtool: 'cheap-source-map' });
});

it('should merge an object and a function', () => {
	const result = mergeWebpackConfig({ entry: 'main.js', devtool: 'cheap-source-map' }, () => ({
		devtool: 'inline-source-map',
	}));
	expect(result).toEqual({ entry: 'main.js', devtool: 'cheap-source-map' });
});

it('should pass an environment to a user config', () => {
	const env = 'production';
	const userConfig = jest.fn();
	mergeWebpackConfig({}, userConfig, env);
	expect(userConfig).toHaveBeenCalledWith(env);
});

it('should ignore certain sections', () => {
	const result = mergeWebpackConfig({ entry: 'main' }, () => ({
		entry: 'other',
		module: { rules: [] },
	}));
	expect(result).toEqual({ entry: 'main', module: { rules: [] } });
});

it('should ignore certain Webpack plugins', (done) => {
	const baseInstance = new TerserPlugin();
	const userInstance = new TerserPlugin();
	const result = mergeWebpackConfig(
		{
			plugins: [baseInstance],
		},
		{
			plugins: [userInstance, new MyPlugin(), new MiniHtmlWebpackPlugin()],
		}
	);
	// this test is necessary as some results can contain no plugins
	if (!result || !result.plugins) {
		done.fail();
		return;
	}
	expect(result.plugins).toHaveLength(2);
	const firstPlugin = result.plugins[0];
	const secondPlugin = result.plugins[1];
	expect(firstPlugin).toBe(baseInstance);
	if (
		!firstPlugin ||
		!secondPlugin ||
		typeof firstPlugin !== 'object' ||
		typeof secondPlugin !== 'object'
	) {
		done.fail('expected plugins');
		return;
	}
	expect(firstPlugin.constructor.name).toBe('TerserPlugin');
	expect(secondPlugin.constructor.name).toBe('MyPlugin');
	done();
});

it('should pass devtool settings in development', () => {
	const result = mergeWebpackConfig(
		{ devtool: false },
		() => ({ devtool: 'source-map' }),
		'development'
	);
	expect(result).toEqual({ devtool: 'source-map' });
});

it('should ignore devtool settings in production', () => {
	const result = mergeWebpackConfig(
		{ devtool: false },
		() => ({ devtool: 'source-map' }),
		'production'
	);
	expect(result).toEqual({ devtool: false });
});
