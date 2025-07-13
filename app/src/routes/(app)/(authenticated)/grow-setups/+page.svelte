<script lang="ts">
	import GrowSetupsActions from '$features/grow-setups/Actions.svelte';
	import GrowSetups from '$features/grow-setups/View.svelte';
</script>

<main>
	<div class="flex items-center justify-between">
		<h1>Grow Setups</h1>
		<GrowSetupsActions />
	</div>
	<GrowSetups />
</main>
