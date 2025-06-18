<script lang="ts">
	import GrowRun from '$features/grow-runs/grow-run/Preview.svelte';
	import { growRuns } from '$features/grow-runs/grow-run/store';
</script>

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
