<script lang="ts">
	import { Resource } from '@grow-run-archive/definitions';

	export let resource: Resource;

	$: ({ cost, name, amountTotal, amountUnit } = resource);
</script>

<td on:click><a href={`/resource/${name}`}>{name}</a></td>
<td on:click>${cost}</td>
<td on:click>{amountTotal}{amountUnit}</td>

<style>
	td {
		padding: 15px;
	}
</style>
