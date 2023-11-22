<script lang="ts">
	import { resourcesList } from '$lib/data/stores';
	import type GrowRun from '$lib/model/growRun';

	export let growRun: GrowRun;

	let expanded = false;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr class="preview" on:click={() => (expanded = !expanded)} on:keypress>
	<td>{growRun.name}</td>
	<td><a href="/experiment/{growRun.fromExperiment}">{growRun.fromExperiment}</a></td>
	<td>how to calc output?</td>
	<td>${growRun.calculateCost().toFixed(2)}</td>
</tr>

<tr>
	<td colspan="10">
		{#if expanded}
			<h4>Resources Used</h4>

			<ul>
				{#each growRun.resources.used as { resource, amountUsed }}
					<li>
						<a href="/resource/{resource.name}">
							{resource.name}
						</a>
						: {amountUsed}{resource.amountUnit}
						(costs {resource.cost}*{amountUsed}/{resource.amountTotal} = ${resource
							.calculateCost(amountUsed)
							.toFixed(2)})
					</li>
				{/each}
			</ul>

			<h4>Output</h4>
			more data...
			<h4>Conditions</h4>
			more data...
		{/if}
	</td>
</tr>

<style>
	.preview {
		cursor: pointer;
		background-color: lightblue;
	}
</style>
