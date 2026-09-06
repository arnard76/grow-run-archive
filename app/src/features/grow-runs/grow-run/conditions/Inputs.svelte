<script lang="ts">
	import RightNowOrTimeInput from '$lib/components/RightNowOrTimeInput.svelte';
	import {
		getConditionMetadata,
		environmentalConditions,
		type ConditionsMeasurements,
		type DateTime,
		type ConditionMeasurement
	} from '@grow-run-archive/definitions';

	export let dateTime: DateTime, value: ConditionMeasurement['value'];
	export let conditionName: keyof ConditionsMeasurements;
</script>

<div class="horizontal-input-group">
	<select bind:value={conditionName}>
		{#each environmentalConditions as environmentalCondition (environmentalCondition)}
			<option value={environmentalCondition}>{environmentalCondition}</option>
		{/each}
	</select>
	:
	{#if conditionName}
		<input type="number" bind:value inputmode="numeric" />
		{getConditionMetadata(conditionName).units}
		<RightNowOrTimeInput bind:dateTime />
	{/if}
</div>
