<script lang="ts">
	import { env } from '$lib/env';
	export let loading;

	// a fixed loading time so animation can be enjoyed :)
	const minLoadingTime = env.MIN_LOADING_TIME ? parseInt(env.MIN_LOADING_TIME) : 1500;
	let minLoadingDone = false;

	setTimeout(() => {
		minLoadingDone = true;
	}, minLoadingTime);
</script>

{#if loading || !minLoadingDone}
	<div class="flex flex-col items-center">
		<h1>loading...</h1>
		<img
			src="plant-growing-logo.webp"
			alt="plant growing animation"
			width="150"
			class="rounded-lg"
		/>
	</div>
{:else}
	<slot />
{/if}
