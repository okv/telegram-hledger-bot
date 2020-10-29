export default ({
	date, postings, description, hledgerBasePath, defaultSecondAccount
}) => {
	let newPostings;
	if (postings?.length === 1) {
		newPostings = [...postings];
		newPostings.push({
			account: defaultSecondAccount,
			amount: newPostings[0].amount * -1
		});
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
