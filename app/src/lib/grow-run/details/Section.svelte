<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import GrowRunPhotos from './GrowRunPhotos.svelte';
	import NameDetails from './NameDetails.svelte';
	import DurationDetails from './duration/Section.svelte';
	export let growRun: GrowRun;
</script>

<NameDetails {growRun} />

<DurationDetails {growRun} />

<GrowRunPhotos {growRun} />
