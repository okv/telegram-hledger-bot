import {addTransaction} from '../../../utils/hledgerRequest/index.mjs';
import parseMessage from './parseMessage.mjs';
import makeTransactionParams from './makeTransactionParams.mjs';

export default async ({
	date, restText, hledgerBasePath, defaultSecondAccount
}) => {
	let replyText;

	const parsedMessage = parseMessage({restText});

	if (parsedMessage.ok) {
		const {postings, description} = parsedMessage;

		await addTransaction(
			makeTransactionParams({
				date,
				postings,
				description,
				hledgerBasePath,
				defaultSecondAccount
			})
		);

		replyText = (
			`Amount ${postings[0].amount} added to account ` +
			`${postings[0].account}`
		);
	} else {
		replyText = parsedMessage.failureReason;
	}

	return {replyText};
};
