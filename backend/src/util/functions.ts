import { DEFAULT_ID_LENGTH } from '@/util/const';
import { ArrayResult } from '@/util/types/types';
import { Paginator } from '@aapc/types';
import { Request } from 'express';

export function getRandomID(length: number = DEFAULT_ID_LENGTH) {
	let result = '';
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export function getPaginator<T extends {}>(
	type: { new (obj: object): T },
	req: Request,
	ar: ArrayResult<T>,
	p: number,
	pp: number
): Paginator<T> {
	const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
	const paginator = new Paginator(type, {
		resultsPerPage: pp,
		currentPage: p,
		totalResults: ar.totalResults,
		data: ar.results
	});
	if (p < paginator.lastPage) {
		url.searchParams.set('p', String(p + 1));
		paginator.nextPageLocation = url.href;
	}
	if (p > 1) {
		url.searchParams.set('p', String(p - 1));
		paginator.prevPageLocation = url.href;
	}
	return paginator;
}
