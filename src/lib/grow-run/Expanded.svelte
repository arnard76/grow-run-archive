<script lang="ts">
	import type GrowRun from '$lib/grow-run';

	import DetailsSection from './details/Section.svelte';
	import HarvestsSection from './harvest/Section.svelte';
	import ResourceUsageSection from './resource-usage/Section.svelte';
	import ConditionsSection from './conditions/Section.svelte';

	import Button from '$lib/components/Button.svelte';
	import { growRunsStore } from './store';

	export let growRun: GrowRun;
</script>

<tr>
	<td colspan="10">
		<DetailsSection {growRun} />
		<ResourceUsageSection {growRun} />
		<HarvestsSection {growRun} />
		<ConditionsSection {growRun} />

		<Button title="Delete" on:click={() => growRunsStore.deleteGrowRun(growRun)}
			>Delete Grow Run</Button
		>
	</td>
</tr>
