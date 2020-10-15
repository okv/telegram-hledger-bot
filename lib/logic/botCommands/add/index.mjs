import {addTransaction} from '../../../utils/hledgerRequest/index.mjs';
import parseMessage from './parseMessage.mjs';

export default async ({
	date, restText, hledgerBasePath, defaultSecondAccount
}) => {
	let replyText;

	const parsedMessage = parseMessage({restText});

	if (parsedMessage.ok) {
		const {postings, description} = parsedMessage;
		if (!postings[1].account) {
			postings[1].account = defaultSecondAccount;
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
