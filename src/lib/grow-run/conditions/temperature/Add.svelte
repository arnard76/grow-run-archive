<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let medium: 'air-temperature' | 'water-temperature';

	let dateTime: string;
	let value: number;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordCondition(medium, { dateTime, value });
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:temperature={value} bind:dateTime />
</AddTemplate>
