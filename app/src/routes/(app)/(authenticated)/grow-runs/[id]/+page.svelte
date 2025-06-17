<script>
	import { growRuns } from '$features/grow-run/store';
	import { page } from '$app/state';
	import View from '$features/grow-run/View.svelte';

	$: growRun = $growRuns.find((growRun) => growRun.id === page.params.id);
</script>

{#if growRun}
	<View {growRun} />
{/if}
