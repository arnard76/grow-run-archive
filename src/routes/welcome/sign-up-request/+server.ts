import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handler as signUpRequestHandler } from '$lib/server/landing-page-signup/signUpRequest';

export const POST: RequestHandler = async ({ request }: any) => {
	try {
		await signUpRequestHandler(await request.json());
	} catch (e: any) {
		error(500, { message: e });
	}

	return new Response();
};
