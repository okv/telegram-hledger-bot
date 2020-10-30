import assert from 'assert';
import makeTransactionParams from
	'../../../../../../lib/logic/botCommands/add/makeTransactionParams.mjs';

describe('logic/botCommands/add/makeTransactionParams with one posting', () => {
	const inputParams = {
		date: Date.now(),
		postings: [{
			account: 'Food', amount: 100
		}],
		description: 'Dinner',
		defaultSecondAccount: 'Assets'
	};
	let result;

	it('should be done without error', () => {
		result = makeTransactionParams(inputParams);
	});

	it('should return expected params', () => {
		assert(typeof result === 'object', 'Should return params object');
		assert.deepStrictEqual(
			result,
			{
				baseUrl: inputParams.baseUrl,
				postings: [
					inputParams.postings[0],
					{account: inputParams.defaultSecondAccount, amount: -100}
				],
				description: inputParams.description,
				date: inputParams.date
			},
			'Params should have expected values'
		);
	});
});
