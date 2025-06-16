<script lang="ts">
	import { growRuns } from '$features/grow-run/store';

	import GrowRun from '$features/grow-run/ListItem.svelte';
	import AddGrowRun from '$features/grow-run/Add.svelte';
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
