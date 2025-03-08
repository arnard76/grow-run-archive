<script lang="ts">
	import type Resource from '.';

	export let resource: Resource;

	$: ({ cost, name, amountType, amountTotal, amountUnit, productLink } = resource);
</script>

<td on:click><a href={`/resource/${name}`}>{name}</a></td>
<td on:click>${cost} for</td>
<td on:click>{amountTotal}{amountUnit}</td>

<style>
	td {
		padding: 5px 15px;
	}
</style>
