<script lang="ts">
	import type Resource from '$lib/resource/resource';

	export let resource: Resource;
	export let amountUsed: number;

	let showExpandedCalculation = false;
	function toggleExpansion() {
		showExpandedCalculation = !showExpandedCalculation;
	}
	let costOfUsage = resource.calculateCost(amountUsed).toFixed(2);
</script>

<li>
	<a href="/resource/{resource.name}">
		{resource.name}
	</a>
	{amountUsed}{resource.amountUnit}

	<p on:mouseenter={toggleExpansion} on:mouseleave={toggleExpansion} role="contentinfo">
		(<span style="color: green;">$</span>{costOfUsage})

		{#if showExpandedCalculation}
			<span class="calculation">
				{resource.cost}*{amountUsed}/{resource.amountTotal} = ${costOfUsage}
			</span>
		{/if}
	</p>
</li>

<style>
	li {
		display: flex;
		align-items: center;
	}

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
	}
</style>
