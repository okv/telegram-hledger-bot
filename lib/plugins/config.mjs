import fastifyPlugin from 'fastify-plugin';
import fastifyEnv from 'fastify-env';

export default fastifyPlugin(async (fastify) => {
	const schema = {
		type: 'object',
		properties: {
			THB_PORT: {type: 'string', minLength: 1, default: '3000'},
			THB_HOST: {type: 'string', minLength: 7, default: '127.0.0.1'},
			THB_BOT_API_BASE_PATH: {
				type: 'string',
				minLength: 8,
				default: 'https://api.telegram.org'
			},
			THB_BOT_TOKEN: {type: 'string', minLength: 3},
			THB_BOT_WEBHOOK_PATH: {type: 'string', minLength: 8}
		},
		required: ['THB_BOT_TOKEN']
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
		host: config.THB_HOST,
		bot: {
			apiBasePath: config.THB_BOT_API_BASE_PATH,
			token: config.THB_BOT_TOKEN,
			webhookPath: config.THB_BOT_WEBHOOK_PATH
		}
	};
});
