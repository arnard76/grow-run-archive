<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import GrowRunPhotos from './GrowRunPhotos.svelte';
	import NameDetails from './NameDetails.svelte';
	import DurationDetails from './duration/Section.svelte';
	import LocationDetails from './location/Section.svelte';
	export let growRun: GrowRun;
</script>

<h4>Details</h4>

<GrowRunPhotos {growRun} />

<NameDetails {growRun} />

<LocationDetails {growRun} />

<DurationDetails {growRun} />
