<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsStore } from '../store';
	export let growRun: GrowRun;

	let updatedGrowName = growRun.name;
</script>

<EditTemplate
	onUpdate={() => {
		growRun.name = updatedGrowName;
		growRunsStore.updateGrowRun(growRun);
	}}
>
	<p slot="display" style="display: inline-block;">
		<span style="font-style: italic;"> Name: </span>
		{growRun.name}
	</p>

	<label slot="editing" style="display: inline-block;">
		Name: <input type="text" bind:value={updatedGrowName} />
	</label>
</EditTemplate>
