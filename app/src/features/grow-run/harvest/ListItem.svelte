<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplateWithInputsReset.svelte';
	import type { Harvest } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '../details/duration/util';

	export let harvest: Harvest;
	export let onUpdateHarvest = (harvest: Harvest) => {};

	let editingHarvestInputs: Harvest;
</script>

<li>
	<EditTemplate
		onUpdate={() => onUpdateHarvest(editingHarvestInputs)}
		currentValue={harvest}
		bind:editedValue={editingHarvestInputs}
	>
		<p slot="display" class="flex flex-wrap w-full">
			<span class="italic flex-1">{prettyFormatDate(harvest.datetime)}</span>

			<span class="flex-grow-0">
				{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)
			</span>
		</p>

		<Inputs slot="editing" bind:harvest={editingHarvestInputs} />
	</EditTemplate>
</li>
