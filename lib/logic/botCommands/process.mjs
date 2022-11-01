import add from './add/index.mjs';

const messageRegExp = new RegExp(
	'^(?<command>/[a-z0-9_]{1,32})? ?(?<restText>.*)$'
);

export default async ({text, ...restParams}) => {
	const {command, restText} = messageRegExp.exec(text)?.groups || {};

	if (!command || command === '/add') {
		return add({restText, ...restParams});
	} else {
		return {replyText: `Unrecognized command: "${command}"`};
	}
};
