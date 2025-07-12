<script lang="ts">
	import { API_URL } from '$env/static/public';
	import type GrowRun from '$features/grow-runs/grow-run';
	import { growRunsAPI } from '$features/grow-runs/grow-run/store';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { growRunActionNames, type Coords } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let updatedGrowRunCoords: Coords | undefined = growRun.location && {
		latitude: growRun.location.latitude,
		longitude: growRun.location.longitude
	};

	const MAX_ADDRESS_UPDATE_INTERVAL = 5000; // in ms
	let lastAddressUpdate: null | number = null;
	let lastCoords: any = undefined;
	let addressDisplayFormat: string | undefined;
	let updatedGrowRunLocation: GrowRun['location'] = growRun.location;

	$: updateLocationStuff(updatedGrowRunCoords);

	async function updateLocationStuff(coordinates: Coords | undefined) {
		if (!coordinates || !coordinates.longitude || !coordinates.latitude) {
			addressDisplayFormat = undefined;
			return;
		}
		if (lastCoords === coordinates) return;

		if (lastAddressUpdate && Date.now() < lastAddressUpdate + MAX_ADDRESS_UPDATE_INTERVAL) {
			setTimeout(() => updateLocationStuff(coordinates), MAX_ADDRESS_UPDATE_INTERVAL);
			return;
		}

		lastAddressUpdate = Date.now();
		lastCoords = { ...coordinates };

		const geocodeResult = await (
			await fetch(`${API_URL}/grow-run/location`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ coords: coordinates })
			})
		).json();

		try {
			addressDisplayFormat = geocodeResult['display_name'];
			updatedGrowRunLocation = { ...coordinates, address: geocodeResult.address };
		} catch (e) {
			console.error("Couldn't parse city or address from " + JSON.stringify({ geocodeResult }));
		}
	}
</script>

<ActionTemplate
	actionName={growRunActionNames.changeLocation}
	onComplete={() => growRunsAPI.updatePartial(growRun.id, { location: updatedGrowRunLocation })}
	onCancel={closeModal}
>
	<Inputs bind:updatedGrowRunCoords />

	{#if addressDisplayFormat}
		<p class="w-full text-wrap">Address: {addressDisplayFormat}</p>
	{/if}
</ActionTemplate>
