<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type Resource from '$lib/resource/resource';
	import Inputs from './Inputs.svelte';
	export let resource: Resource;

	$: ({ cost, name, amountType, amountTotal, amountUnit } = resource);
</script>

<li>
	<EditTemplate onClick={() => {}}>
		<p slot="display">
			{name} - ${cost} for
			{amountTotal}{amountUnit}
			({amountType})
		</p>

		<Inputs slot="editing" bind:cost bind:name bind:amountType bind:amountTotal bind:amountUnit />
	</EditTemplate>
</li>

<style>
	li {
		display: flex;
		gap: 10px;
		align-items: center;
		text-wrap: nowrap;
	}
</style>
