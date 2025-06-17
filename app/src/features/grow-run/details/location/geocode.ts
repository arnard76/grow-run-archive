export function parseCity(geocodeResult: any): string {
	const city =
		geocodeResult['address']['county'] ||
		geocodeResult['address']['city'] ||
		geocodeResult['address']['state'];
	return city;
}

export function parseAddress(geocodeResult: any): string {
	return geocodeResult['display_name'];
}
