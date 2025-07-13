<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import { growSetups } from '$features/grow-setups/store';

	export let growRun: GrowRun;

	$: growSetup = $growSetups.find((randomGrowSetup) => randomGrowSetup.id === growRun.growSetup);
</script>

{#if growSetup}
	<a href="/grow-setups/{growSetup.id}">{growSetup.name}</a>
{/if}
