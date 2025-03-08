<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { Harvest } from './types';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '../details/duration/util';

	export let harvest: Harvest;
	export let onUpdateHarvest = (harvest: Harvest) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdateHarvest(harvest)}>
		<p slot="display" class="flex flex-wrap w-full">
			<span class="italic flex-1">{prettyFormatDate(harvest.datetime) || 'Undated'}</span>

			<span class="flex-grow-0">
				{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)
			</span>
		</p>

		<Inputs slot="editing" bind:harvest />
	</EditTemplate>
</li>
