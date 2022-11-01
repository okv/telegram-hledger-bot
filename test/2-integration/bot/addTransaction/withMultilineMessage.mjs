import assert from 'assert';
import fastify from 'fastify';
import fetch from 'node-fetch';
import initApp from '../../../../lib/app.mjs';

describe('bot add transaction with multiline message', () => {
	const app = fastify({
		bodyLimit: 10240,
		logger: {level: 'error', prettyPrint: true}
	});
	const hledgerApp = fastify({logger: {level: 'error', prettyPrint: true}});
	let testData;

	before(() => {
		process.env.THB_PORT = '3001';
		process.env.THB_HOST = '127.0.0.1';
		process.env.THB_HLEDGER_BASE_PATH = 'http://127.0.0.1:5001';
		process.env.THB_BOT_TOKEN = 'fake';
		process.env.THB_BOT_WEBHOOK_PATH = '/telegram/webhook';
		process.env.THB_DEFAULT_SECOND_ACCOUNT = 'Assets:Cash';

		testData = {
			date: {
				timestamp: Math.floor(
					new Date('2020-10-15T00:00:00Z').getTime() / 1000
				),
				isoString: '2020-10-15'
			},
			text: '123 Fuel\nline 2'
		};
	});

	before(async () => {
		initApp(app);
		await app.ready();
		await app.launchBot();

		hledgerApp.putAddReqs = [];
		hledgerApp.put('/add', (req) => {
			hledgerApp.putAddReqs.push(req);
			return {};
		});
		hledgerApp.get('/accountnames', () => {
			return [];
		});
		const hledgerUrl = new URL(process.env.THB_HLEDGER_BASE_PATH);
		await hledgerApp.listen(hledgerUrl.port, hledgerUrl.hostname);
	});

	it('should return error message', async () => {
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
				date: testData.date.timestamp,
				text: testData.text
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
		const resultText = await response.text();
		if (!response.ok) {
			throw new Error(
				`Error while fetch POST ${url}: ${response.statusText}`
			);
		}
		const resultJson = JSON.parse(resultText);
		assert.deepStrictEqual(
			resultJson,
			{
				method: 'sendMessage',
				chat_id: 1,
				text: (
					'Sorry, cannot understand what to do, "add" ' +
					'command should go like this: /add (amount) ' +
					'(first account)[;second account] [description]'
				),
				reply_to_message_id: 1
			}
		);
	});

	it('should not call hledger', async () => {
		assert.strictEqual(
			hledgerApp.putAddReqs?.length,
			0,
			'Should not call hledger'
		);
	});

	after(async () => {
		await app.close();
		await hledgerApp.close();
	});
});
