<script lang="ts">
	import units from '$lib/grow-run/units';
	import type Resource from './index';

	export let resourceToCreateOrUpdate: Resource;
</script>

<input type="text" bind:value={resourceToCreateOrUpdate.name} placeholder="resource name" />
<label>
	&nbsp;- costs $<input
		type="number"
		bind:value={resourceToCreateOrUpdate.cost}
		placeholder="cost for amount"
	/>
	NZD&nbsp;
</label>
<label>
	for
	<input type="number" bind:value={resourceToCreateOrUpdate.amountTotal} placeholder="amount" />
</label>
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
{/if}
<label style="margin-left: 20px;">
	product link
	<input
		type="text"
		placeholder="link for product page"
		bind:value={resourceToCreateOrUpdate.productLink}
	/>
</label>
