import assert from 'assert';
import fastify from 'fastify';
import fetch from 'node-fetch';
import initApp from '../../../../lib/app.mjs';

describe('bot add transaction with ok message', () => {
	const app = fastify();
	const hledgerApp = fastify();
	let hledgerUrl;

	before(async () => {
		process.env.THB_PORT = '3001';
		process.env.THB_HOST = '127.0.0.1';
		process.env.THB_HLEDGER_BASE_PATH = 'http://127.0.0.1:5001';
		process.env.THB_BOT_TOKEN = 'fake';
		process.env.THB_BOT_WEBHOOK_PATH = '/telegram/webhook';
		initApp(app);
		await app.ready();
		await app.launchBot();

		hledgerApp.put('/add', (req) => {
			return {};
		});
		hledgerUrl = new URL(process.env.THB_HLEDGER_BASE_PATH);
		await hledgerApp.listen(hledgerUrl.port, hledgerUrl.hostname);
	});

	it('should be ok', async () => {
		const body = {
			update_id: 1,
			message: {
				message_id: 1,
				from: {
					id: 1,
					is_bot: false,
					first_name: 'John',
					last_name: 'Doe',
					username: 'john_doe',
					language_code: 'en'
				},
				chat: {
					id: 1,
					first_name: 'John',
					last_name: 'Doe',
					username: 'john_doe',
					type: 'private'
				},
				date: Math.round(Date.now() / 1000),
				text: '/add 100 food'
			}
		};

		const url = (
			`http://${process.env.THB_HOST}:${process.env.THB_PORT}` +
			`${process.env.THB_BOT_WEBHOOK_PATH}`
		);
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json'
			}
		});
		const result = await response.text();
		if (!response.ok) {
			throw new Error(
				`Error while fetch POST ${url}: ${response.statusText}`
			);
		}
		const json = JSON.parse(result);
		assert.deepStrictEqual(
			json,
			{
				method: 'sendMessage',
				chat_id: 1,
				text: 'Amount 100 added to account food',
				reply_to_message_id: 1
			}
		);
	});

	after(async () => {
		await app.stopBot();
		await hledgerApp.close();
	});
});
