<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import type GrowRun from '$features/grow-run';
	import type { ConditionsMeasurements } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	export let conditionName: keyof ConditionsMeasurements;

	let dateTime: string;
	let value: number;
</script>

<AddTemplate
	onAdd={() => growRun.recordCondition(conditionName, { dateTime, value })}
	addText="Record"
>
	<Inputs {conditionName} bind:value bind:dateTime />
</AddTemplate>
