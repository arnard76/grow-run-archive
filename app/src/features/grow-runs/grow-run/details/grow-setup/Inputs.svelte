<script lang="ts">
	import { growSetups } from '$features/grow-setups/store';
	import { type GrowSetupType } from '@grow-run-archive/definitions';
	export let updatedGrowSetup: GrowSetupType['id'] | undefined;
</script>

<select bind:value={updatedGrowSetup}>
	{#each $growSetups as growSetup (growSetup.id)}
		<option value={growSetup.id}>{growSetup.name}</option>
	{/each}
</select>
