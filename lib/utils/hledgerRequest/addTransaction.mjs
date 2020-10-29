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

	const url = urlJoin(baseUrl, '/add');

	const response = await fetch(url, {
		method: 'put',
		body: JSON.stringify(body),
		headers: {'content-type': 'application/json'}
	});

	if (!response.ok) {
		throw new Error(
			`Error while fetch PUT ${url}: ${response.statusText}`
		);
	}
};
