import {addTransaction} from '../../../utils/hledgerRequest/index.mjs';
import parseMessage from './parseMessage.mjs';

export default async ({
	date, restText, hledgerBasePath, defaultSecondAccount
}) => {
	let replyText;

	const parsedMessage = parseMessage({restText});

	if (parsedMessage.ok) {
		const {postings, description} = parsedMessage;
		if (postings.length === 1) {
			postings.push({
				account: defaultSecondAccount,
				amount: parsedMessage.postings[0].amount * -1
			});
		}

		await addTransaction({
			baseUrl: hledgerBasePath,
			postings,
			description,
			date
		});

		replyText = (
			`Amount ${postings[0].amount} added to account ` +
			`${postings[0].account}`
		);
	} else {
		replyText = parsedMessage.failureReason;
	}

	return {replyText};
};
