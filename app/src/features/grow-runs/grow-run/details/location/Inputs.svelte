<script lang="ts">
	import { type Coords } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';
	import floatRegex from 'float-regex';
	export let updatedGrowRunCoords: Coords | { longitude: undefined; latitude: undefined } = {
		latitude: undefined,
		longitude: undefined
	};

	function getUserLocation() {
		if ('geolocation' in navigator) {
			/* geolocation is available */
			navigator.geolocation.getCurrentPosition(
				({ coords }) =>
					(updatedGrowRunCoords = { latitude: coords.latitude, longitude: coords.longitude }),
				(e) => console.log('something has gone wrong :(', e),
				{ enableHighAccuracy: true }
			);
		} else {
			/* geolocation IS NOT available */
			alert('Geolocation is not available.');
		}
	}

	function attemptPasteCoords(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text');
		if (!pasted) return;

		const coordsStringRegex = new RegExp(floatRegex.source + ', ' + floatRegex.source);
		if (coordsStringRegex.test(pasted)) {
			const [latitude, longitude] = pasted.split(', ').map((string) => parseFloat(string));
			updatedGrowRunCoords = { longitude, latitude };
		} else {
			console.error('Did not match the regex expression', pasted, coordsStringRegex.test(pasted));
		}
	}
</script>

<div>
	<h4>Device Location</h4>
	<button on:click={getUserLocation}>Get Current Location</button>
</div>

<div>
	<h4>
		Coordinates <a href="https://maps.google.com/" target="_blank">
			<Icon icon="tabler:external-link" />
		</a>
	</h4>
	<label class="horizontal-input-group">
		Latitude
		<input
			type="number"
			min="-90.0000000000"
			max="90.0000000000"
			on:paste={attemptPasteCoords}
			bind:value={updatedGrowRunCoords.latitude}
		/>
	</label>
	<label class="horizontal-input-group">
		Longitude
		<input
			type="number"
			min="-180.0000000000"
			max="180.0000000000"
			on:paste={attemptPasteCoords}
			bind:value={updatedGrowRunCoords.longitude}
		/>
	</label>
</div>
