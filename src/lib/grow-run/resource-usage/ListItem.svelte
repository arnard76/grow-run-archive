<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '../growRun';
	import { growRunsStore, resourcesList } from '../stores';
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
		onClick={() => {
			growRun.editResourceUsage(initialResourceName, {
				name: resourceName,
				amountUsed: amountUsed
			});
			growRunsStore.updateGrowRun(growRun);
		}}
		onDeleteClick={() => {
			growRun.deleteResourceUsage(initialResourceName);
			growRunsStore.updateGrowRun(growRun);
		}}
	>
		<svelte:fragment slot="display">
			<a href="/resource/{resourceName}">
				{resourceName}
			</a>
			{amountUsed}{resource.amountUnit}

			<p on:mouseenter={toggleExpansion} on:mouseleave={toggleExpansion} role="contentinfo">
				(<span style="color: green;margin: auto 0; ">$</span>{costOfUsage})

				{#if showExpandedCalculation}
					<span class="calculation">
						{resource.cost}*{amountUsed}/{resource.amountTotal} = ${costOfUsage}
					</span>
				{/if}
			</p>
		</svelte:fragment>

		<svelte:fragment slot="editing">
			<Inputs bind:amountUsedInput={amountUsed} bind:selectedResourceToUse={resourceName} />
		</svelte:fragment>
	</EditTemplate>
</li>

<style>
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
	}
</style>
