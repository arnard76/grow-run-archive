<script lang="ts">
	import Button from './Button.svelte';

	export let addText = '➕';
	export let onClick: (e: MouseEvent) => any;

	let expanded = false;
</script>

{#if expanded}
	<slot />
{/if}

<Button
	on:click={(e) => {
		expanded && onClick(e);
		expanded = !expanded;
	}}
>
	{addText}
</Button>
