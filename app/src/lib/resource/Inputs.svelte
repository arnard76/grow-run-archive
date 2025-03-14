<script lang="ts">
	import units from '$lib/grow-run/units';
	import type Resource from './index';

	export let resourceToCreateOrUpdate: Resource;
</script>

<div class="horizontal-input-group">
	<select
		bind:value={resourceToCreateOrUpdate.amountType}
		title="Select how the amount of this resource is specified"
	>
		{#each Object.keys(units) as type (type)}
			<option value={type}>{type}</option>
		{/each}
	</select>
	<pre>:</pre>
	<input type="number" bind:value={resourceToCreateOrUpdate.amountTotal} placeholder="amount" />
	{#if resourceToCreateOrUpdate.amountType && Object.keys(units).includes(resourceToCreateOrUpdate.amountType)}
		<select
			bind:value={resourceToCreateOrUpdate.amountUnit}
			title="Select the unit of measuring an amount of this resource"
		>
			{#each units[resourceToCreateOrUpdate.amountType] as unit}
				<option value={unit}>{unit}</option>
			{/each}
		</select>
	{/if}

	<pre> of </pre>
	<input type="text" bind:value={resourceToCreateOrUpdate.name} placeholder="resource name" />
	<pre> for $</pre>
	<input type="number" bind:value={resourceToCreateOrUpdate.cost} placeholder="product price" />
	<pre>NZD</pre>
</div>

<label>
	Product Page URL
	<input
		type="text"
		placeholder="https://company.com/product-id"
		bind:value={resourceToCreateOrUpdate.productLink}
	/>
</label>

<label>
	<span>Notes</span>
	<textarea bind:value={resourceToCreateOrUpdate.notes} cols="30" rows="5"></textarea>
</label>
