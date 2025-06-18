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

<span class="w-[300px]">
	{usageOfResource.amountUsed}{resource.amountUnit}
	<a href="/resource/{usageOfResource.resourceName}">
		{usageOfResource.resourceName}
	</a>
</span>

<p on:mouseenter={toggleExpansion} on:mouseleave={toggleExpansion} role="contentinfo">
	<span style="color: green;margin: auto 0; ">$</span>{costOfUsage}

	{#if showExpandedCalculation}
		<span class="calculation">
			{resource.cost} * {usageOfResource.amountUsed}{resource.amountUnit} / {resource.amountTotal}{resource.amountUnit}
			= ${costOfUsage}
		</span>
	{/if}
</p>
