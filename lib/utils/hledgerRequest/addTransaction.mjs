import assert from 'assert';
import fetch from 'node-fetch';
import urlJoin from 'url-join';
import dateFormat from 'dateformat';

export default async ({
	baseUrl, date, postings, description
}) => {
	assert(postings?.length === 2, 'Postings must have two elements');

	const [firstPosting, secondPosting] = postings;
	const makeDecimalMantissa = (number) => number * 10000000000;
	const dateString = dateFormat(date, 'isoDate');

	const body = {
		tcomment: '',
		tpostings: [{
			pbalanceassertion: null,
			pstatus: 'Unmarked',
			pamount: [{
				aprice: null,
				acommodity: '',
				aquantity: {
					floatingPoint: firstPosting.amount,
					decimalPlaces: 10,
					decimalMantissa: makeDecimalMantissa(firstPosting.amount)
				},
				aismultiplier: false,
				astyle: {
					ascommodityside: 'L',
					asdigitgroups: null,
					ascommodityspaced: false,
					asprecision: {
						tag: 'Precision',
						contents: 2
					},
					asdecimalpoint: '.'
				}
			}],
			ptransaction_: '1',
			paccount: firstPosting.account,
			pdate: null,
			ptype: 'RegularPosting',
			pcomment: '',
			pdate2: null,
			ptags: [],
			poriginal: null
		}, {
			pbalanceassertion: null,
			pstatus: 'Unmarked',
			pamount: [{
				aprice: null,
				acommodity: '',
				aquantity: {
					floatingPoint: secondPosting.amount,
					decimalPlaces: 10,
					decimalMantissa: makeDecimalMantissa(secondPosting.amount)
				},
				aismultiplier: false,
				astyle: {
					ascommodityside: 'L',
					asdigitgroups: null,
					ascommodityspaced: false,
					asprecision: {
						tag: 'Precision',
						contents: 2
					},
					asdecimalpoint: '.'
				}
			}],
			ptransaction_: '1',
			paccount: secondPosting.account,
			pdate: null,
			ptype: 'RegularPosting',
			pcomment: '',
			pdate2: null,
			ptags: [],
			poriginal: null
		}],
		ttags: [],
		tsourcepos: {
			tag: 'JournalSourcePos',
			contents: [
				'/data/some.journal', [
					2,
					4
				]
			]
		},
		tdate: dateString,
		tcode: '',
		tindex: 1,
		tprecedingcomment: '',
		tdate2: null,
		tdescription: description,
		tstatus: 'Unmarked'
	};

	const addUrl = urlJoin(baseUrl, '/add');
	const addResponse = await fetch(addUrl, {
		method: 'put',
		body: JSON.stringify(body),
		headers: {'content-type': 'application/json'}
	});
	if (!addResponse.ok) {
		throw new Error(
			`Error while fetch PUT ${addUrl}: ${addResponse.statusText}`
		);
	}

	// here goes an odd part - to be sure that web ledger ui will be notified
	// about all transactions that we put we need to touch any api
	// (reproduced with docker hledger 1.19.1)
	const getUrl = urlJoin(baseUrl, '/accountnames');
	const getResponse = await fetch(getUrl);
	if (!getResponse.ok) {
		throw new Error(
			`Error while fetch GET ${getUrl}: ${getResponse.statusText}`
		);
	}
};
