import add from './add.mjs';

const messageRegExp = new RegExp(
	'^(?<command>/[a-z0-9_]{1,32})? ?(?<restText>.*)$'
);

export default async ({text}) => {
	const {command, restText} = messageRegExp.exec(text).groups;

	if (!command || command === '/add') {
		return add({restText});
	} else {
		return {replyText: `Unrecognized command: "${command}"`};
	}
};
