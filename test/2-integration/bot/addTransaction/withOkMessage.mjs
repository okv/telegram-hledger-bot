import assert from 'assert';
import fastify from 'fastify';
import fetch from 'node-fetch';
import initApp from '../../../../lib/app.mjs';

describe('bot add transaction with ok message', () => {
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
			firstAccount: 'Fuel',
			amount: 123
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

	it('should return expected result', async () => {
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
				text: `/add ${testData.amount} ${testData.firstAccount}`
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
					`Amount ${testData.amount} added to account ` +
					`${testData.firstAccount}`
				),
				reply_to_message_id: 1
			}
		);
	});

	it('should call hledger with expected params', async () => {
		assert.strictEqual(
			hledgerApp.putAddReqs?.length,
			1,
			'Should call hledger once'
		);
		const {body} = hledgerApp.putAddReqs[0];
		assert(typeof body === 'object', 'Body should be an object');
		assert.strictEqual(
			body.tdate,
			testData.date.isoString,
			'Body should have date'
		);
		assert.strictEqual(
			body.tdescription,
			'',
			'Body should have empty description'
		);
		assert.strictEqual(
			body?.tpostings?.length,
			2,
			'Two postings should be presented'
		);
		assert.strictEqual(
			body?.tpostings?.[0]?.paccount,
			testData.firstAccount,
			'First posting should have account'
		);
		assert.strictEqual(
			body?.tpostings?.[0]?.pamount?.[0]?.aquantity?.floatingPoint,
			testData.amount,
			'Fisrt posting should have amount'
		);
		assert.strictEqual(
			body?.tpostings?.[1]?.paccount,
			process.env.THB_DEFAULT_SECOND_ACCOUNT,
			'Second posting should have account'
		);
		assert.strictEqual(
			body?.tpostings?.[1]?.pamount?.[0]?.aquantity?.floatingPoint,
			testData.amount * -1,
			'Second posting should have amount'
		);
	});

	after(async () => {
		await app.stopBot?.();
		await hledgerApp.close();
	});
});
