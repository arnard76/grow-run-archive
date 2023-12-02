<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { Harvest } from './types';
	import Inputs from './Inputs.svelte';

	export let harvest: Harvest;
	export let onUpdateHarvest = () => {};
</script>

<li>
	<EditTemplate onClick={() => onUpdateHarvest()}>
		<p slot="display" style="display: inline-block;">
			{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)
		</p>

		<Inputs
			slot="editing"
			bind:numberOfLeaves={harvest.numberOfLeaves}
			bind:massOfLeaves={harvest.massOfLeaves}
		/>
	</EditTemplate>
</li>
