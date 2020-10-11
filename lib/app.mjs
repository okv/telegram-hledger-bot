import pathUtils from 'path';
import urlUtils from 'url';
import autoLoad from 'fastify-autoload';

export default async (fastify, opts) => {
	const dir = pathUtils.dirname(
		urlUtils.fileURLToPath(import.meta.url)
	);

	fastify.register(autoLoad, {
		dir: pathUtils.join(dir, 'plugins'),
		options: opts
	});

	fastify.register(autoLoad, {
		dir: pathUtils.join(dir, 'routes'),
		options: opts
	});
};
