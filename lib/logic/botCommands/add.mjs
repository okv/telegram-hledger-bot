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

export default ({restText}) => {
	let replyText;

	const execResult = messageRegExp.exec(restText);
	if (execResult) {
		const {
			amountString, firstAccount
		} = execResult.groups;
		const amount = Number(amountString);

		replyText = `I'm going add: ${amount} to account ${firstAccount}`;
	} else {
		replyText = cannotParseReplyText;
	}

	return {replyText};
};
