<script lang="ts">
	import GrowSetup from './grow-setup/View.svelte';
	import Location from './location/View.svelte';
	import Duration from './duration/View.svelte';
	import Photos from './photos/View.svelte';
	import GrowRun from '..';

	export let growRun: GrowRun;
</script>

<div class="flex-1 w-[90%]">
	<h2>{growRun.name}</h2>

	<GrowSetup {growRun} />
	<Location {growRun} />
	<Duration {growRun} />
	<Photos {growRun} />
</div>
