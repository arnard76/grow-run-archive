<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import Inputs from './Inputs.svelte';
	import type ConditionsMeasurements from '../conditions';

	export let growRun: GrowRun;
	export let conditionName: keyof ConditionsMeasurements;

	let dateTime: string;
	let value: number;
</script>

<AddTemplate
	onClick={() => growRun.recordCondition(conditionName, { dateTime, value })}
	addText="Record"
>
	<Inputs {conditionName} bind:value bind:dateTime />
</AddTemplate>
