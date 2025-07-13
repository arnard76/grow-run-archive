<script lang="ts">
	import GrowSetup from '$features/grow-setups/grow-setup/Preview.svelte';
	import { growSetups } from '$features/grow-setups/store';
</script>

<ul>
	{#each $growSetups as growSetup}
		<GrowSetup {growSetup} />
	{/each}
</ul>
