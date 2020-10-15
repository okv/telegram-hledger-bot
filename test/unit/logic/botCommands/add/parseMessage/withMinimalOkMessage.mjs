import assert from 'assert';
import parseMessage from
	'../../../../../../lib/logic/botCommands/add/parseMessage.mjs';

describe('logic/botCommands/add/parseMessage with minimal ok message', () => {
	let parsedMessage;

	it('should be done without error', () => {
		parsedMessage = parseMessage({restText: '100 Expenses'});
	});

	it('should return expected parsed message', () => {
		assert(typeof parsedMessage === 'object', 'Should return parsed message');
		assert.equal(parsedMessage.ok, true, 'Parsed message should be ok');
		assert.deepStrictEqual(
			parsedMessage.postings,
			[{account: 'Expenses', amount: 100}, {account: null, amount: -100}],
			'Parsed message should have postings'
		);
		assert.equal(
			parsedMessage.description,
			'',
			'Parsed message should have empty descripition'
		);
	});
});
