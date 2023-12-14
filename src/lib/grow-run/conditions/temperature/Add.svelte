<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let medium: 'air-temperature' | 'water-temperature';

	let dateTime: string;
	let temperature: number;
</script>

<AddTemplate
	onClick={() => {
		growRun.recordTemperature(medium, { dateTime, temperature });
		growRunsStore.updateGrowRun(growRun);
	}}
	addText="Record"
>
	<Inputs bind:temperature bind:dateTime />
</AddTemplate>
