<script lang="ts">
	import GrowRunsActions from '$features/grow-runs/Actions.svelte';
	import GrowRuns from '$features/grow-runs/View.svelte';
</script>

<main class="p-2">
	<div class="flex items-center justify-between">
		<h1>Grow Runs</h1>
		<GrowRunsActions />
	</div>
	<GrowRuns />
</main>
