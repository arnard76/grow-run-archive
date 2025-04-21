import { SECRET_LOCATION_IQ_API_KEY } from '$env/static/private';
import type { Coords } from '@grow-run-archive/definitions';

export async function reverseGeocode(latitude: Coords['latitude'], longitude: Coords['longitude']) {
	const locationIQAPIUrl =
		`https://us1.locationiq.com/v1/reverse?` +
		new URLSearchParams({
			lat: latitude.toString(),
			lon: longitude.toString(),
			format: 'json',
			key: SECRET_LOCATION_IQ_API_KEY
		});

	return await (await fetch(locationIQAPIUrl)).json();
}
