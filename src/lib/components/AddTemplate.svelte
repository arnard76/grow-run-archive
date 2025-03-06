<script lang="ts">
	import Icon from '@iconify/svelte';

	export let addText = 'Add';
	export let onClick: (e: MouseEvent) => any;

	let expanded = false;
</script>

{#if expanded}
	<slot />
{/if}

<button
	on:click={(e) => {
		expanded && onClick(e);
		expanded = !expanded;
	}}
	title={addText}
>
	{#if expanded}
		<Icon icon="tabler:check" />
	{:else}
		<Icon icon="tabler:plus" />
	{/if}
</button>
