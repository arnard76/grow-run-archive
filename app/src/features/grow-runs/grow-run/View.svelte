<script lang="ts">
	import GrowRun from '.';
	import Actions from './Actions.svelte';
	import ResourceUsages from './resource-usages/View.svelte';
	import Harvests from './harvests/View.svelte';
	import Details from './details/View.svelte';
	import EnvironmentalConditions from './conditions/View.svelte';

	export let growRun: GrowRun;
</script>

<div class="overflow-x-clip grow-run-page">
	<section class="flex items-start drop-shadow-md rounded-b-xl w-full bg-blue-400 text-white">
		<Details {growRun} />
		<Actions {growRun} />
	</section>

	<ResourceUsages {growRun} />
	<hr />

	<Harvests {growRun} />
	<hr />

	<EnvironmentalConditions {growRun} />
</div>

<style lang="postcss">
	hr {
		@apply border-solid border-4 rounded-md border-blue-400 w-[96%] m-auto;
	}
</style>
