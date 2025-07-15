<script lang="ts">
	import GrowSetup1 from '$features/grow-setups/grow-setup/Preview.svelte';
	import { growSetups } from '$features/grow-setups/store';
	import { GrowSetup } from '@grow-run-archive/definitions';

	$: sortedGrowSetups = GrowSetup.sort($growSetups);
</script>

<ul>
	{#each sortedGrowSetups as growSetup}
		<GrowSetup1 {growSetup} />
	{/each}
</ul>

<style lang="postcss">
	ul {
		@apply flex flex-col gap-4;
	}
</style>
