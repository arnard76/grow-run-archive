<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '$lib/grow-run/store';
	import { getLongLatAndTimeZone } from './geocodingAPI';

	export let growRun: GrowRun;

	let locationInput: HTMLInputElement | undefined;
	let long: number | undefined, lat: number | undefined;

	growRun.location &&
		getLongLatAndTimeZone(growRun.location).then(
			({ timeZone, coords }: { timeZone: string; coords: number[] }) => {
				growRun.timeZone = timeZone;
				[long, lat] = coords;
			}
		);

	$: console.log({ growRun });
</script>

<EditTemplate
	onClick={async () => {
		if (!locationInput) return;

		growRun.location = locationInput.value;
		let { timeZone, coords } = await getLongLatAndTimeZone(locationInput.value);
		growRun.timeZone = timeZone;
		[long, lat] = coords;
		console.log({ timeZone, growRun });
		await growRunsStore.updateGrowRun(growRun);
	}}
>
	<div slot="display">
		{#if growRun.location}
			{growRun.location} | ({lat}, {long}) | {growRun.timeZone}
		{:else}
			No location provided
		{/if}
	</div>

	<div slot="editing">
		<input type="text" bind:this={locationInput} value={growRun.location} />
		{#if long && lat}({long}, {lat}){/if}
	</div></EditTemplate
>
