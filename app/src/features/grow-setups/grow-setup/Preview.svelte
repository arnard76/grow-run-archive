<script lang="ts">
	import type { GrowSetup } from '@grow-run-archive/definitions';
	import Icon from '@iconify/svelte';
	export let growSetup: GrowSetup;
</script>

<li>
	<a href="/grow-setups/{growSetup.id}" class="flex-1">
		{growSetup.name}
	</a>
	{#if growSetup.link}
		<a href={growSetup.link} target="_blank" class="flex gap-2 items-center bg-green-500">
			<span>Full Design</span>
			<Icon icon="tabler:external-link" />
		</a>
	{/if}
</li>

<style lang="postcss">
	li {
		border-radius: var(--brad);
		@apply flex items-center overflow-hidden justify-between bg-[lightblue];
	}

	a {
		@apply p-4;
	}
</style>
