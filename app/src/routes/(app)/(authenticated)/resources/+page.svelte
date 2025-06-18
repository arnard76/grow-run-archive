<script lang="ts">
	import Actions from '$features/resources/Actions.svelte';
	import Resource from '$features/resources/resource/View.svelte';
	import { resourcesList } from '$features/resources/store';
</script>

<main class="p-2">
	<div class="flex items-center justify-between">
		<h1>Resources</h1>

		<Actions />
	</div>

	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Cost (NZD)</th>
				<th>Amount</th>
			</tr>
		</thead>
		<tbody>
			{#each structuredClone($resourcesList) as resource (resource.id)}
				<Resource {resource} />
			{/each}
		</tbody>
	</table>
</main>
