<script lang="ts">
	import { growRuns } from '$lib/grow-run/store';

	import GrowRun from '$lib/grow-run/ListItem.svelte';
	import AddGrowRun from '$lib/grow-run/Add.svelte';
</script>

<slot />

<h1>Grow Runs</h1>
<AddGrowRun />
<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Output (g)</th>
			<th>Cost (NZD)</th>
			<th>Cost per 100g (NZD)</th>
		</tr>
	</thead>

	<tbody>
		{#each $growRuns as growRun}
			<GrowRun {growRun} />
		{/each}
	</tbody>
</table>
