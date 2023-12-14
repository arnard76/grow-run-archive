<script lang="ts">
	import units from '$lib/grow-run/units';
	import type Resource from './index';

	export let resourceToCreateOrUpdate: Resource;
</script>

It costs $<input
	type="number"
	bind:value={resourceToCreateOrUpdate.cost}
	placeholder="cost goes here..."
/>
NZD<br />
for
<input
	type="number"
	bind:value={resourceToCreateOrUpdate.amountTotal}
	placeholder="amount of product..."
/>
<select bind:value={resourceToCreateOrUpdate.amountType}>
	{#each Object.keys(units) as type (type)}
		<option value={type}>{type}</option>
	{/each}
</select>
{#if resourceToCreateOrUpdate.amountType && Object.keys(units).includes(resourceToCreateOrUpdate.amountType)}
	<select bind:value={resourceToCreateOrUpdate.amountUnit}>
		{#each units[resourceToCreateOrUpdate.amountType] as unit}
			<option value={unit}>{unit}</option>
		{/each}
	</select>
{/if}<br />
of
<input
	type="text"
	bind:value={resourceToCreateOrUpdate.name}
	placeholder="resource name here..."
/><br />
<br />
<input
	type="text"
	placeholder="link for product page..."
	bind:value={resourceToCreateOrUpdate.productLink}
/>
