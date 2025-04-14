<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import ConditionsSection from './conditions/Section.svelte';
	import DetailsSection from './details/Section.svelte';
	import HarvestsSection from './harvest/Section.svelte';
	import ResourceUsageSection from './resource-usage/Section.svelte';
	import Icon from '@iconify/svelte';
	import { growRunsAPI } from './store';
	import { growRunActionNames } from '@grow-run-archive/definitions';

	export let record: GrowRun;
	$: console.log({ record });
</script>

<div class="w-full grow-run-archive-expanded-modal">
	<section
		class="flex flex-col items-start drop-shadow-md rounded-b-xl w-full bg-blue-400 text-white"
	>
		<DetailsSection growRun={record} />
	</section>
	<ResourceUsageSection growRun={record} />

	<hr />

	<HarvestsSection growRun={record} />
	<hr />

	<ConditionsSection growRun={record} />
	<hr />

	<button
		title={growRunActionNames.delete}
		class="danger flex m-auto my-4"
		on:click={() => growRunsAPI.delete(record.id)}
	>
		<Icon icon="tabler:trash" />
	</button>
</div>

<style lang="postcss">
	hr {
		@apply border-dashed border-8 border-blue-400;
	}
</style>
