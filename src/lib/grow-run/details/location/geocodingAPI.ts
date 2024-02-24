export async function getLongLatAndTimeZone(locationText: string) {
	const apiKey = `bb7267377dfd4987ac58e0c80ff02bf0`;
	const res = await fetch(
		`https://api.geoapify.com/v1/geocode/search?text=${locationText}&apiKey=${apiKey}`
	);

	const json = await res.json();
	console.log({ json });
	return {
		coords: json.features[0].geometry.coordinates,
		timeZone: json.features[0].properties.timezone.name
	};
}

// export async function getTimezoneName(locationText: string) {
// 	const res = await fetch(
// 		`https://api.geoapify.com/v1/geocode/search?text=${locationText}&apiKey=${apiKey}`
// 	);

// 	const json = await res.json();
// 	console.log({ json });
// 	return json.features[0].properties.timezone.name;
// }
