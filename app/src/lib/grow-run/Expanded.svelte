<script lang="ts">
	import type GrowRun from '$lib/grow-run';

	import DetailsSection from './details/Section.svelte';
	import HarvestsSection from './harvest/Section.svelte';
	import ResourceUsageSection from './resource-usage/Section.svelte';
	import ConditionsSection from './conditions/Section.svelte';

	import { growRuns, growRunsAPI } from './store';

	export let growRun: GrowRun;
	export let onClose: any;

	let expandedGrowRunModal: undefined | HTMLDialogElement;

	$: if (expandedGrowRunModal) expandedGrowRunModal.showModal();
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={expandedGrowRunModal}
	aria-modal
	class="grow-run-archive-expanded-modal"
	on:click={(e) => {
		if (!expandedGrowRunModal) return;
		const { left, right, top, bottom } = expandedGrowRunModal.getBoundingClientRect();

		if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
			expandedGrowRunModal.close();
			onClose();
		}
	}}
	on:keypress
>
	<section class="flex items-start drop-shadow-md rounded-b-xl w-full bg-blue-400 text-white">
		<div class="flex-1 w-[90%]">
			<DetailsSection {growRun} />
		</div>
		<button title="Close Grow Run" on:click={onClose}>❌</button>
	</section>
	<ResourceUsageSection {growRun} />

	<hr />

	<HarvestsSection {growRun} />
	<hr />

	<ConditionsSection {growRun} />
	<hr />

	<div class="my-4 text-center">
		<button title="Delete" on:click={() => growRunsAPI.delete(growRun.id)}>Delete Grow Run</button>
	</div>
</dialog>

<style lang="postcss">
	dialog {
		@apply p-0 m-auto border-none rounded-xl drop-shadow-md max-h-[90vh] md:max-w-[75%] w-full;
	}

	hr {
		@apply border-dashed border-8 border-blue-400;
	}
</style>
