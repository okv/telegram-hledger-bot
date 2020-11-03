export default ({
	date, postings, description, hledgerBasePath,
	defaultSecondAccount, firstAccountParent
}) => {
	let newPostings;
	if (postings?.length >= 1) {
		newPostings = [...postings];

		if (firstAccountParent) {
			newPostings[0] = {...newPostings[0]};
			newPostings[0].account = (
				`${firstAccountParent}:${newPostings[0].account}`
			);
		}

		if (postings.length === 1) {
			newPostings.push({
				account: defaultSecondAccount,
				amount: newPostings[0].amount * -1
			});
		}
	} else {
		newPostings = postings;
	}

	return {
		baseUrl: hledgerBasePath,
		postings: newPostings,
		description,
		date
	};
};
