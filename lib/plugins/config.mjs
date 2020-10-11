import fastifyPlugin from 'fastify-plugin';
import fastifyEnv from 'fastify-env';

export default fastifyPlugin(async (fastify) => {
	const schema = {
		type: 'object',
		properties: {
			THB_PORT: {type: 'string', default: 3000},
			THB_HOST: {type: 'string', default: '127.0.0.1'}
		}
	};

	fastify.register(fastifyEnv, {
		confKey: 'config',
		dotenv: true,
		data: process.env,
		schema
	});

	await fastify.after();

	const {config} = fastify;
	fastify.log.info('Config loaded: %j', JSON.stringify(config, null, 2));

	// repack config vars
	// eslint-disable-next-line no-param-reassign
	fastify.config = {
		port: config.THB_PORT,
		host: config.THB_HOST
	};
});
