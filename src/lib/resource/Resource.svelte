<script lang="ts">
	import type Resource from '$lib/resource/resource';
	export let resource: Resource;
</script>

<li>
	<p>
		{resource.name} - ${resource.cost} for
		{resource.amountTotal}{resource.amountUnit}
		({resource.amountType})
	</p>
</li>

<style>
	li {
		display: flex;
		gap: 10px;
	}
</style>
