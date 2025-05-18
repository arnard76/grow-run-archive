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

	let expandedGrowRunModal: undefined | HTMLDialogElement;

	$: if (expandedGrowRunModal) expandedGrowRunModal.showModal();

	function closeGrowRun() {
		expandedGrowRunModal?.close();
		goto('/grow-runs');
	}
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
			closeGrowRun();
		}
	}}
	on:keypress
>
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
</dialog>

<style lang="postcss">
	dialog {
		@apply p-0 m-auto border-none rounded-xl drop-shadow-md max-h-[90vh] md:max-w-[75%] w-full;
	}

	hr {
		@apply border-dashed border-8 border-blue-400;
	}
</style>
