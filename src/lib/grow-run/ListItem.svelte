<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import Preview from './Preview.svelte';
	import Expanded from './Expanded.svelte';

	export let growRun: GrowRun;

	let expanded = false;
</script>

<Preview {growRun} on:click={() => (expanded = !expanded)} />

{#if expanded}
	<Expanded {growRun} />
{/if}
