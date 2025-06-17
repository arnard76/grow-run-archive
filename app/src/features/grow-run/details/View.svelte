<script lang="ts">
	import GrowRun from '..';

	export let growRun: GrowRun;

	import Location from './location/View.svelte';
	import Duration from './duration/View.svelte';
	import Photos from './photos/View.svelte';
</script>

<div class="flex-1 w-[90%]">
	<section class="flex gap-4">
		<h2 class="inline-block m-0">
			{growRun.name}
		</h2>
		<Location {growRun} />
	</section>

	<Duration {growRun} />

	<Photos {growRun} />
</div>
