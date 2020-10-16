// this is how we parse the message
const messageRegExp = new RegExp(
	'^(?<amountString>-?[0-9]+(\\.[0-9]+)?) +(?<firstAccount>[a-zA-Zа-яА-Я:]+);?' +
	'(?<secondAccount>[a-zA-Zа-яА-Я:]+)?(?<description> +.*)?$'
);

// this is how it shown to the user
const failureReason = (
	'Sorry, cannot understand what to do, "add" command should go like this: ' +
	'/add (amount) (first account)[;second account] [description]'
);

export default ({restText}) => {
	let parsedMessage;
	const execResult = messageRegExp.exec(restText);

	if (execResult) {
		const {
			amountString, firstAccount, secondAccount, description
		} = execResult.groups;
		const amount = Number(amountString);

		const postings = [{account: firstAccount, amount}];
		if (secondAccount) {
			postings.push({account: secondAccount, amount: amount * -1});
		}

		parsedMessage = {
			ok: true,
			description: description || '',
			postings
		};
	} else {
		parsedMessage = {ok: false, failureReason};
	}

	return parsedMessage;
};
