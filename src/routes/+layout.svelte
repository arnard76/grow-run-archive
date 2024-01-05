<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';

	let password: string | undefined;
</script>

<input type="text" placeholder="password" bind:value={password} />
{#if password === 'GRA-FTW-v1'}
	<Menu />
	<slot />
{/if}
