<script>
	import loadingAnimation from '$lib/images/plant-growing-loading.webp';

	export let loading;

	// a fixed loading time so animation can be enjoyed :)
	let minLoadingDone = false;

	setTimeout(() => {
		minLoadingDone = true;
	}, 1500);
</script>

{#if loading || !minLoadingDone}
	<div class="flex flex-col items-center">
		<h1>loading...</h1>
		<img src={loadingAnimation} alt="plant growing animation" width="150px" class="rounded-lg" />
	</div>
{:else}
	<slot />
{/if}
