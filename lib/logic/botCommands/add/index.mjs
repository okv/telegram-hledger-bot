import {addTransaction} from '../../../utils/hledgerRequest/index.mjs';
import parseMessage from './parseMessage.mjs';
import makeTransactionParams from './makeTransactionParams.mjs';

export default async ({
	date, restText, hledgerBasePath, defaultSecondAccount, firstAccountParent,
	capitalizeAccount
}) => {
	let replyText;

	const parsedMessage = parseMessage({restText});

	if (parsedMessage.ok) {
		const {postings, description} = parsedMessage;

		const transactionParams = makeTransactionParams({
			date,
			postings,
			description,
			hledgerBasePath,
			defaultSecondAccount,
			firstAccountParent,
			capitalizeAccount
		});

		await addTransaction(transactionParams);

		replyText = (
			`Amount ${transactionParams.postings[0].amount} added to account ` +
			`${transactionParams.postings[0].account}`
		);
	} else {
		replyText = parsedMessage.failureReason;
	}

	return {replyText};
};
