<script>
	import Expanded from '$lib/grow-run/Expanded.svelte';
	import { growRuns } from '$lib/grow-run/store';
	import { page } from '$app/state';

	$: growRun = $growRuns.find((growRun) => growRun.id === page.params.id);
</script>

{#if growRun}
	<Expanded {growRun} />
{/if}
