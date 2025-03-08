<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '../store';
	export let growRun: GrowRun;

	let updatedGrowName = growRun.name;
</script>

<section>
	<EditTemplate
		onUpdate={() => {
			growRun.name = updatedGrowName;
			growRunsStore.updateGrowRun(growRun);
		}}
	>
		<h2 slot="display" class="inline-block m-0">
			{growRun.name}
		</h2>

		<label slot="editing" style="display: inline-block;">
			<input placeholder="Enter grow run name" type="text" bind:value={updatedGrowName} />
		</label>
	</EditTemplate>
</section>
