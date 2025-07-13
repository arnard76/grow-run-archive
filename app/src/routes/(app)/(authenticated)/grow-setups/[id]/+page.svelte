<script>
	import { page } from '$app/state';
	import View from '$features/grow-setups/grow-setup/View.svelte';
	import { growSetups } from '$features/grow-setups/store';

	$: growSetup = $growSetups.find((growSetup) => growSetup.id === page.params.id);
</script>

<main>
	{#if growSetup}
		<View {growSetup} />
	{/if}
</main>
