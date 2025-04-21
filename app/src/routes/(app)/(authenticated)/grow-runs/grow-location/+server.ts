import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { reverseGeocode } from '$lib/server/google-maps/geocode';

export const POST: RequestHandler = async ({ request }) => {
	const { coords } = await request.json();
	const geocodeResult = await reverseGeocode(coords.latitude, coords.longitude);
	return json(geocodeResult);
};
