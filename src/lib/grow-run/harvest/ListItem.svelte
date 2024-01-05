<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { Harvest } from './types';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '../details/duration/util';

	export let harvest: Harvest;
	export let onUpdateHarvest = (harvest: Harvest) => {};
</script>

<li>
	<EditTemplate onClick={() => onUpdateHarvest(harvest)}>
		<p slot="display" style="display: inline-block;">
			<span style="font-style:italic; width: 300px; display:inline-block;"
				>{prettyFormatDate(harvest.datetime) || 'Undated'}</span
			>{harvest.massOfLeaves}g ({harvest.numberOfLeaves}
			leaves)
		</p>

		<Inputs slot="editing" bind:harvest />
	</EditTemplate>
</li>
