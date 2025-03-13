<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { growRunsAPI } from '$lib/grow-run/store';
	import { resourcesList } from '$lib/resource/store';
	import type GrowRun from '..';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let resourceName: string;
	const initialResourceName = resourceName;
	export let amountUsed: number;

	let showExpandedCalculation = false;
	function toggleExpansion() {
		showExpandedCalculation = !showExpandedCalculation;
	}

	$: resource = resourcesList.getResource(resourceName);
	$: costOfUsage = resource.calculateCost(amountUsed).toFixed(2);
</script>

<li>
	<EditTemplate
		onUpdate={() => {
			growRun.editResourceUsage(initialResourceName, {
				resourceName,
				amountUsed
			});
			growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
		}}
		onDelete={() => {
			growRun.deleteResourceUsage(initialResourceName);
			growRunsAPI.updatePartial(growRun.id, { resources: growRun.resources });
		}}
	>
		<svelte:fragment slot="display">
			<span class="w-[300px]">
				{amountUsed}{resource.amountUnit}
				<a href="/resource/{resourceName}">
					{resourceName}
				</a>
			</span>

			<p on:mouseenter={toggleExpansion} on:mouseleave={toggleExpansion} role="contentinfo">
				<span style="color: green;margin: auto 0; ">$</span>{costOfUsage}

				{#if showExpandedCalculation}
					<span class="calculation">
						{resource.cost} * {amountUsed}{resource.amountUnit} / {resource.amountTotal}{resource.amountUnit}
						= ${costOfUsage}
					</span>
				{/if}
			</p>
		</svelte:fragment>

		<svelte:fragment slot="editing">
			<Inputs bind:amountUsedInput={amountUsed} bind:selectedResourceToUse={resourceName} />
		</svelte:fragment>
	</EditTemplate>
</li>

<style lang="postcss">
	li > * {
		flex: 1;
		max-width: 250px;
	}

	p {
		cursor: pointer;
		display: inline;
		position: relative;
	}

	p span.calculation {
		cursor: initial;
		background-color: powderblue;
		position: absolute;
		text-wrap: nowrap;
		padding: 0 5px;
		margin: 0 5px;
		top: calc(100% + 5px);
		left: 0;
		z-index: 1;

		@apply p-4 rounded-xl;
	}
</style>
