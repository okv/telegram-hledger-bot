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
			date,
			text
		});
		if (replyText) {
			ctx.reply(replyText, {reply_to_message_id: messageId});
		}
	});

	fastify.decorate('launchBot', async () => {
		if (config.bot.webhookPath) {
			return bot.startWebhook(
				config.bot.webhookPath,
				null,
				config.port,
				config.host
			);
		} else {
			return bot.startPolling();
		}
	});
}, {
	decorators: {
		fastify: ['config']
	}
});
