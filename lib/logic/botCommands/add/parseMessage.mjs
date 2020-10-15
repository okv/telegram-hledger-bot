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

		parsedMessage = {
			ok: true,
			postings: [{
				account: firstAccount, amount
			}, {
				account: secondAccount || null, amount: amount * -1
			}],
			description: description || ''
		};
	} else {
		parsedMessage = {ok: false, failureReason};
	}

	return parsedMessage;
};
