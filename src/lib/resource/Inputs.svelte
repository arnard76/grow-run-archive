<script lang="ts">
	import units from '$lib/grow-run/units';

	export let cost: number,
		amountTotal: number,
		amountType: string,
		amountUnit: string,
		name: string;
</script>

It costs $<input type="number" bind:value={cost} /> NZD<br />
for <input type="number" bind:value={amountTotal} />
<select bind:value={amountType}>
	{#each Object.keys(units) as type (type)}
		<option value={type}>{type}</option>
	{/each}
</select>
{#if amountType && Object.keys(units).includes(amountType)}
	<select bind:value={amountUnit}>
		{#each units[amountType] as unit}
			<option value={unit}>{unit}</option>
		{/each}
	</select>
{/if}<br />
of <input type="text" bind:value={name} placeholder="resource name here..." /><br />
