import assert from 'assert';
import fastifyPlugin from 'fastify-plugin';
import Telegraf from 'telegraf';
import * as botCommandsLogic from '../logic/botCommands/index.mjs';

export default fastifyPlugin(async (fastify) => {
	const {config} = fastify;

	const bot = new Telegraf(config.bot.token, {
		telegram: {
			apiRoot: config.bot.apiBasePath
		}
	});

	bot.on('text', async (ctx) => {
		assert(typeof ctx.message === 'object', 'Message must be an object');
		const {text, message_id: messageId, date: timestamp} = ctx.message;
		assert(typeof text === 'string', 'Message must have text');
		assert(typeof messageId === 'number', 'Message must have id');
		assert(typeof timestamp === 'number', 'Message must have date');
		const date = new Date(timestamp * 1000);

		const {replyText} = await botCommandsLogic.process({
			hledgerBasePath: config.hledgerBasePath,
			defaultSecondAccount: config.defaultSecondAccount,
			firstAccountParent: config.firstAccountParent,
			capitalizeAccount: config.capitalizeAccount,
			date,
			text
		});
		if (replyText) {
			ctx.reply(replyText, {reply_to_message_id: messageId});
		}
	});

	bot.catch((err) => {
		fastify.log.error({err});
	});

	if (config.bot.webhookPath) {
		fastify.log.info('Add telegram updates webhook to the server');
		fastify.post(config.bot.webhookPath, (req, reply, next) => {
			bot.handleUpdate(req.body, reply.raw)
				.then(() => {
					// in case when handler doesn't respond to the client
					if (!reply.raw.headersSent) {
						reply.code(500).send();
					}
				})
				.catch(next);
		});
	}

	fastify.decorate('launchBot', async () => {
		if (config.bot.webhookPath) {
			return fastify.listen(config.port, config.host);
		} else {
			fastify.log.info('Start polling to get telegram updates');
			return bot.startPolling();
		}
	});
	fastify.decorate('stopBot', async () => {
		if (config.bot.webhookPath) {
			await fastify.close();
		}
		await bot.stop();
	});
}, {
	dependencies: ['config'],
	decorators: {
		fastify: ['config']
	}
});
