<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import ConditionsSection from './conditions/Section.svelte';
	import DetailsSection from './details/Section.svelte';
	import HarvestsSection from './harvest/Section.svelte';
	import ResourceUsageSection from './resource-usage/Section.svelte';
	import Icon from '@iconify/svelte';
	import { growRunsAPI } from './store';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import { goto } from '$app/navigation';

	export let growRun: GrowRun;

	function closeGrowRun() {
		goto('/grow-runs');
	}
</script>

<div class="overflow-x-clip">
	<section class="flex items-start drop-shadow-md rounded-b-xl w-full bg-blue-400 text-white">
		<div class="flex-1 w-[90%]">
			<DetailsSection {growRun} />
		</div>
		<button title={growRunActionNames.close} on:click={closeGrowRun}
			><Icon icon="tabler:x" /></button
		>
	</section>
	<ResourceUsageSection {growRun} />

	<hr />

	<HarvestsSection {growRun} />
	<hr />

	<ConditionsSection {growRun} />
	<hr />

	<button
		title={growRunActionNames.delete}
		class="danger flex m-auto my-4"
		on:click={() => {
			growRunsAPI.delete(growRun.id);
			closeGrowRun();
		}}
	>
		<Icon icon="tabler:trash" />
	</button>
</div>

<style lang="postcss">
	hr {
		@apply border-dashed border-8 border-blue-400;
	}
</style>
