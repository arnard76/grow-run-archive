<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplateWithInputsReset.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunActionNames, type Coords } from '@grow-run-archive/definitions';
	import { growRunsAPI } from '../store';
	import Icon from '@iconify/svelte';
	import { parseAddress, parseCity } from '$lib/grow-run/google-maps/geocode';
	export let growRun: GrowRun;

	let updatedGrowRunLocation: GrowRun['location'];
	let coords: Coords | { longitude: undefined; latitude: undefined } = growRun.location || {
		latitude: undefined,
		longitude: undefined
	};
	let addressSearchTerm: string = '';
	let address: string | undefined;
	let city: string | undefined;
	const MAX_ADDRESS_UPDATE_INTERVAL = 5000; // in ms
	let lastAddressUpdate = Date.now() - 2 * MAX_ADDRESS_UPDATE_INTERVAL;
	let lastCoords: any = undefined;

	$: updateLocationStuff(coords);

	async function updateLocationStuff(
		coordinates: Coords | { longitude: undefined; latitude: undefined }
	) {
		if (!coordinates.latitude || !coordinates.longitude) {
			city = undefined;
			address = undefined;
			return;
		}

		if (lastCoords === coordinates) {
			console.log({ lastCoords, coordinates });
			return;
		}

		if (Date.now() < lastAddressUpdate + MAX_ADDRESS_UPDATE_INTERVAL) {
			setTimeout(() => updateLocationStuff(coordinates), MAX_ADDRESS_UPDATE_INTERVAL);
			return;
		}

		lastAddressUpdate = Date.now();
		lastCoords = { ...coordinates };

		const geocodeResult = await (
			await fetch('./grow-runs/grow-location', {
				method: 'POST',
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
				(position) => {
					coords = position.coords;
					console.log('updated 1');
				},
				(e) => {
					console.log('something has gone wrong :(', e);
				}
			);
			console.log('updated');
		} else {
			/* geolocation IS NOT available */
			alert('Geolocation is not available.');
		}
	}

	$: console.log({ updatedGrowRunLocation });
	$: console.log({ coords });
	$: console.log({ growRun });
</script>

<section>
	<EditTemplate
		onUpdate={() => growRunsAPI.updatePartial(growRun.id, { location: updatedGrowRunLocation })}
		editText={growRunActionNames.addLocation}
		currentValue={growRun.location}
		bind:editedValue={updatedGrowRunLocation}
	>
		<p slot="display" class="inline-block m-0">
			{#if growRun.location}
				<a
					href="https://www.google.com/maps/place/{growRun.location.latitude},{growRun.location
						.longitude}"
					target="_blank"
					class="no-underline"
				>
					<Icon icon="tabler:map-pin" />
					{#if city}<span>{city}</span>{/if}
				</a>
			{:else}
				No location
			{/if}
		</p>

		<svelte:fragment slot="editing">
			<button on:click={getUserLocation}>Use Device Location</button>
			or
			<label>
				Grow Run Address
				<input
					placeholder="Enter Address for Grow Run"
					type="text"
					bind:value={addressSearchTerm}
				/>
			</label>
			or
			<p>Coordinates</p>
			<label>
				Latitude
				<input type="number" step="any" bind:value={coords.latitude} />
			</label>
			<label>
				Longitude
				<input type="number" step="any" bind:value={coords.longitude} />
			</label>

			{#if city}<p>City: {city}</p>{/if}
			{#if address}<p>Address: {address}</p>{/if}
		</svelte:fragment>
	</EditTemplate>
</section>
