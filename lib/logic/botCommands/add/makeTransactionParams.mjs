export default ({
	date, postings, description, hledgerBasePath,
	defaultSecondAccount, firstAccountParent, capitalizeAccount
}) => {
	let newPostings;
	if (postings?.length >= 1) {
		newPostings = [...postings];

		if (capitalizeAccount) {
			const capitalize = (str) => {
				return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
			};

			newPostings[0].account = capitalize(newPostings[0].account);
			if (newPostings[1]) {
				newPostings[1].account = capitalize(newPostings[1].account);
			}
		}

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
