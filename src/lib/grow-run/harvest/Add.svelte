<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/stores';
	import type GrowRun from '$lib/grow-run/growRun';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;

	let massOfLeaves: number;
	let numberOfLeaves: number;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordHarvest({
			id: Math.random().toString(16).slice(2),
			massOfLeaves,
			numberOfLeaves
		});
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:massOfLeaves bind:numberOfLeaves />
</AddTemplate>
