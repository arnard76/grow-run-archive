<script lang="ts">
	import type GrowRun from '$lib/grow-run/growRun';

	import DetailsSection from './details/Section.svelte';
	import HarvestsSection from './harvests/Section.svelte';
	import ResourceUsageSection from './resource-usage/Section.svelte';
	import ConditionsSection from './conditions/Section.svelte';

	export let growRun: GrowRun;
</script>

<tr>
	<td colspan="10">
		<DetailsSection {growRun} />
		<ResourceUsageSection {growRun} />
		<HarvestsSection {growRun} />
		<ConditionsSection {growRun} />
	</td>
</tr>
