<script>
	import Expanded from '$features/grow-run/Expanded.svelte';
	import { growRuns } from '$features/grow-run/store';
	import { page } from '$app/state';

	$: growRun = $growRuns.find((growRun) => growRun.id === page.params.id);
</script>

{#if growRun}
	<div class="p-4">
		<Expanded {growRun} />
	</div>
{/if}
