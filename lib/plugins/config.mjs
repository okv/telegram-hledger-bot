import fastifyPlugin from 'fastify-plugin';
import fastifyEnv from 'fastify-env';

export default fastifyPlugin(async (fastify) => {
	const schema = {
		type: 'object',
		properties: {
			THB_PORT: {type: 'string', minLength: 1, default: '3000'},
			THB_HOST: {type: 'string', minLength: 7, default: '0.0.0.0'},
			THB_BOT_API_BASE_PATH: {
				type: 'string',
				minLength: 8,
				default: 'https://api.telegram.org'
			},
			THB_BOT_TOKEN: {type: 'string', minLength: 3},
			THB_BOT_WEBHOOK_PATH: {type: 'string', minLength: 8},
			THB_HLEDGER_BASE_PATH: {
				type: 'string',
				minLength: 8,
				default: 'http://127.0.0.1:5000'
			},
			THB_DEFAULT_SECOND_ACCOUNT: {
				type: 'string',
				minLength: 1,
				default: 'Assets'
			}
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
	const redactedConfig = {...config, THB_BOT_TOKEN: '*****'};
	fastify.log.info({config: redactedConfig});

	// repack config vars
	// eslint-disable-next-line no-param-reassign
	fastify.config = {
		port: config.THB_PORT,
		host: config.THB_HOST,
		bot: {
			apiBasePath: config.THB_BOT_API_BASE_PATH,
			token: config.THB_BOT_TOKEN,
			webhookPath: config.THB_BOT_WEBHOOK_PATH
		},
		hledgerBasePath: config.THB_HLEDGER_BASE_PATH,
		defaultSecondAccount: config.THB_DEFAULT_SECOND_ACCOUNT
	};
});
