import assert from 'assert';
import makeTransactionParams from
	'../../../../../../lib/logic/botCommands/add/makeTransactionParams.mjs';

const describeTitle = (
	'logic/botCommands/add/makeTransactionParams with first account parent'
);

describe(describeTitle, () => {
	const inputParams = {
		date: Date.now(),
		postings: [{
			account: 'Food', amount: 100
		}, {
			account: 'Assets', amount: -100
		}],
		description: 'Dinner',
		firstAccountParent: 'Expenses'
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
					{
						account: (
							`${inputParams.firstAccountParent}:` +
							`${inputParams.postings[0].account}`
						),
						amount: inputParams.postings[0].amount
					},
					inputParams.postings[1]
				],
				description: inputParams.description,
				date: inputParams.date
			},
			'Params should have expected values'
		);
	});
});
