import assert from 'assert';
import fastify from 'fastify';
import Telegraf from 'telegraf';
import * as botCommandsLogic from './logic/botCommands/index.mjs';
import initApp from './app.mjs';

const main = async () => {
	const app = fastify({logger: {prettyPrint: true}});
	initApp(app);
	await app.ready();

	const {config} = app;

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

	if (config.bot.webhookPath) {
		await bot.startWebhook(
			config.bot.webhookPath,
			null,
			config.port,
			config.host
		);
	} else {
		await bot.startPolling();
	}
};

main().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Error ocurred: ', (err && err.stack) || err);
});
