<script lang="ts">
	import { resourcesList } from '$features/resources/store';
	import type { ResourceUsage } from '@grow-run-archive/definitions';

	export let usageOfResource: ResourceUsage;

	let showExpandedCalculation = false;
	function toggleExpansion() {
		showExpandedCalculation = !showExpandedCalculation;
	}

	$: resource = resourcesList.getResource(usageOfResource.resourceName);
	$: costOfUsage = resource.calculateCost(usageOfResource.amountUsed).toFixed(2);
</script>

<li class="flex">
	<p class="w-[300px]">
		{usageOfResource.amountUsed}{resource.amountUnit}
		<a href="/resource/{usageOfResource.resourceName}">
			{usageOfResource.resourceName}
		</a>
	</p>

	<p
		on:mouseenter={toggleExpansion}
		on:mouseleave={toggleExpansion}
		role="contentinfo"
		class="relative"
	>
		<span style="color: green;margin: auto 0; ">$</span>{costOfUsage}

		{#if showExpandedCalculation}
			<span class="calculation">
				${resource.cost} * {usageOfResource.amountUsed}{resource.amountUnit} / {resource.amountTotal}{resource.amountUnit}
				= ${costOfUsage}
			</span>
		{/if}
	</p>
</li>

<style lang="postcss">
	p span.calculation {
		background-color: powderblue;
		position: absolute;
		text-wrap: nowrap;
		padding: 0 5px;
		margin: 0 5px;
		top: 50%;
		transform: translateY(-50%);
		left: 100%;
		z-index: 1;

		@apply p-4 rounded-xl;
	}
</style>
