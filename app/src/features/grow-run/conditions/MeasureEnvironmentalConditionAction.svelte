<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { growRunActionNames, type ConditionsMeasurements } from '@grow-run-archive/definitions';
	import Inputs from './Inputs.svelte';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;
	let conditionName: keyof ConditionsMeasurements;

	let dateTime: string;
	let value: number;
</script>

<ActionTemplate
	actionName={growRunActionNames.measureEnvironmentalCondition}
	onCancel={closeModal}
	onComplete={() => growRun.recordCondition(conditionName, { dateTime, value })}
>
	<Inputs bind:conditionName bind:value bind:dateTime />
</ActionTemplate>
