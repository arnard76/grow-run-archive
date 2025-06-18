<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { parseAddress, parseCity } from '$features/grow-runs/grow-run/details/location/geocode';
	import { type Coords } from '@grow-run-archive/definitions';

	export let updatedGrowRunLocation: Coords | { longitude: undefined; latitude: undefined } = {
		latitude: undefined,
		longitude: undefined
	};
	let addressSearchTerm: string = '';
	let address: string | undefined;
	let city: string | undefined;
	const MAX_ADDRESS_UPDATE_INTERVAL = 5000; // in ms
	let lastAddressUpdate = Date.now() - 2 * MAX_ADDRESS_UPDATE_INTERVAL;
	let lastCoords: any = undefined;

	$: updateLocationStuff(updatedGrowRunLocation);

	async function updateLocationStuff(
		coordinates: Coords | { longitude: undefined; latitude: undefined }
	) {
		if (!coordinates.latitude || !coordinates.longitude) {
			city = undefined;
			address = undefined;
			return;
		}

		if (lastCoords === coordinates) return;

		if (Date.now() < lastAddressUpdate + MAX_ADDRESS_UPDATE_INTERVAL) {
			setTimeout(() => updateLocationStuff(coordinates), MAX_ADDRESS_UPDATE_INTERVAL);
			return;
		}

		lastAddressUpdate = Date.now();
		lastCoords = { ...coordinates };

		const geocodeResult = await (
			await fetch(`${PUBLIC_API_URL}/grow-run/location`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ coords: coordinates })
			})
		).json();

		try {
			city = parseCity(geocodeResult);
			address = parseAddress(geocodeResult);
		} catch (e) {
			console.error("Couldn't parse city or address from " + JSON.stringify({ geocodeResult }));
		}

		updatedGrowRunLocation = coordinates;
	}

	$: if (addressSearchTerm) {
		// get coords for address and set
		// updatedGrowRunLocation = coordsForAddress
	}

	function getUserLocation() {
		if ('geolocation' in navigator) {
			/* geolocation is available */
			navigator.geolocation.getCurrentPosition(
				(position) => (updatedGrowRunLocation = position.coords),
				(e) => console.log('something has gone wrong :(', e)
			);
		} else {
			/* geolocation IS NOT available */
			alert('Geolocation is not available.');
		}
	}
</script>

<button on:click={getUserLocation}>Use Device Location</button>
or
<label>
	Grow Run Address
	<input placeholder="Enter Address for Grow Run" type="text" bind:value={addressSearchTerm} />
</label>
or
<p>Coordinates</p>
<label>
	Latitude
	<input type="number" step="any" bind:value={updatedGrowRunLocation.latitude} />
</label>
<label>
	Longitude
	<input type="number" step="any" bind:value={updatedGrowRunLocation.longitude} />
</label>

{#if city}<p>City: {city}</p>{/if}
{#if address}<p>Address: {address}</p>{/if}
