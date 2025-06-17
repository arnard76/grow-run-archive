<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import type GrowRun from '$features/grow-run';
	import { parseCity } from '$features/grow-run/details/location/geocode';
	import type { Coords } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';

	export let growRun: GrowRun;

	let city: string | undefined;

	$: updateLocationStuff(growRun.location);

	async function updateLocationStuff(coordinates?: Coords) {
		if (!coordinates) {
			city = undefined;
			return;
		}

		const geocodeResult = await (
			await fetch(`${PUBLIC_API_URL}/grow-run/location`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ coords: coordinates })
			})
		).json();

		try {
			city = parseCity(geocodeResult);
		} catch (e) {
			console.error("Couldn't parse city or address from " + JSON.stringify({ geocodeResult }));
		}
	}
</script>

<p>
	{#if growRun.location}
		Location:
		<a
			href="https://www.google.com/maps/place/{growRun.location.latitude},{growRun.location
				.longitude}"
			target="_blank"
			class="no-underline"
		>
			<Icon icon="tabler:map-pin" class="mb-[-4px]" />
			{#if city}<span>{city}</span>{/if}
		</a>
	{:else}
		No location
	{/if}
</p>
