<script lang="ts">
	import { growRuns } from '$features/grow-runs/grow-run/store';
	import type { GrowSetup } from '@grow-run-archive/definitions';
	import GrowRun from '$features/grow-runs/grow-run/Preview.svelte';
	import Icon from '@iconify/svelte';

	export let growSetup: GrowSetup;
	$: growRunsWithThisSetup = $growRuns.filter((growRun) => growRun.growSetup === growSetup.id);
</script>

<h1>
	{#if growSetup.link}
		<a href={growSetup.link} target="_blank">
			{growSetup.name}
			<Icon icon="tabler:external-link" />
		</a>
	{:else}
		{growSetup.name}
	{/if}
</h1>

{#if growRunsWithThisSetup.length}
	<h2>Grow runs using setup</h2>
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
			{#each growRunsWithThisSetup as growRun}
				<GrowRun {growRun} />
			{/each}
		</tbody>
	</table>
{:else}
	<p>No grow runs using this setup</p>
{/if}
