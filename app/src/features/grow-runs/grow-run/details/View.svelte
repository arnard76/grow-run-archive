<script lang="ts">
	import GrowRun from '..';

	export let growRun: GrowRun;

	import Location from './location/View.svelte';
	import Duration from './duration/View.svelte';
	import Photos from './photos/View.svelte';
</script>

<div class="flex-1 w-[90%]">
	<h2>{growRun.name}</h2>

	<Location {growRun} />

	<Duration {growRun} />

	<Photos {growRun} />
</div>
