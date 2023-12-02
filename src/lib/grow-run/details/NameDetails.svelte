<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run/growRun';
	import { growRunsStore } from '../stores';
	export let growRun: GrowRun;

	let updatedGrowName = growRun.name;
</script>

<EditTemplate
	onClick={() => {
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
