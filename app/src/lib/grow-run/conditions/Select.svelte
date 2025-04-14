<script lang="ts">
	import { definedConditions } from './conditions';
	import type { ConditionsMeasurements } from '@grow-run-archive/definitions';

	export let selectedCondition: keyof ConditionsMeasurements;
</script>

<select bind:value={selectedCondition}>
	{#each definedConditions as definedCondition (definedCondition)}
		<option value={definedCondition}>{definedCondition}</option>
	{/each}
</select>
