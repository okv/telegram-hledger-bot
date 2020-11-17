import assert from 'assert';
import makeTransactionParams from
	'../../../../../../lib/logic/botCommands/add/makeTransactionParams.mjs';

const describeTitle = (
	'logic/botCommands/add/makeTransactionParams with capitalize account'
);

describe(describeTitle, () => {
	const inputParams = {
		date: Date.now(),
		postings: [{
			account: 'food', amount: 100
		}, {
			account: 'assets', amount: -100
		}],
		description: 'dinner',
		capitalizeAccount: true
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
					{account: 'Food', amount: 100},
					{account: 'Assets', amount: -100}
				],
				description: inputParams.description,
				date: inputParams.date
			},
			'Params should have expected values'
		);
	});
});
