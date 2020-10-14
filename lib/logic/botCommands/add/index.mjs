import {addTransaction} from '../../../utils/hledgerRequest/index.mjs';

// this is how we parse the message
const messageRegExp = new RegExp(
	'^(?<amountString>-?[0-9]+(\\.[0-9]+)?) +(?<firstAccount>[a-zA-Zа-яА-Я:]+);?' +
	'(?<secondAccount>[a-zA-Zа-яА-Я:]+)?(?<description> +.*)?$'
);

// this is how it shown to the user
const cannotParseReplyText = (
	'Sorry, cannot understand what to do, "add" command should go like this: ' +
	'/add (amount) (first account)[;second account] [description]'
);

export default async ({
	date, restText, hledgerBasePath, defaultSecondAccount
}) => {
	let replyText;

	const execResult = messageRegExp.exec(restText);
	if (execResult) {
		const {
			amountString, firstAccount, secondAccount, description
		} = execResult.groups;
		const amount = Number(amountString);

		await addTransaction({
			baseUrl: hledgerBasePath,
			postings: [{
				account: firstAccount, amount
			}, {
				account: (secondAccount || defaultSecondAccount),
				amount: amount * -1
			}],
			description: description || '',
			date
		});

		replyText = `Amount ${amount} added to account ${firstAccount}`;
	} else {
		replyText = cannotParseReplyText;
	}

	return {replyText};
};
