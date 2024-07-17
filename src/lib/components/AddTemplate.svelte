<script lang="ts">
	export let addText = '➕';
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
>
	{addText}
</button>
