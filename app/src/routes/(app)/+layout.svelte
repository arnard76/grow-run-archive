<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { session } from '$lib/firebase/user';

	import loadingAnimation from '$lib/images/plant-growing-loading.webp';
	import Menu from '$lib/components/Menu.svelte';
	import { page } from '$app/stores';
	import { initializeFirebase } from '$lib/firebase';
	import { onDestroy } from 'svelte';
	import { resourcesList } from '$lib/resource/store';
	import { growRunsStore } from '$lib/grow-run/store';

	import '$lib/styles/global.css';

	let authUnsubscribe = () => {};
	$: if (browser) {
		authUnsubscribe = initializeFirebase() || (() => {});
	}

	onDestroy(authUnsubscribe);

	const openRoutes = [
		'/login',
		'/sign-up',
		'/forgot-password',
		'/confirm-password-reset',
		'/welcome'
	];

	$: if (browser && $session && !$session.loading) {
		let currentPath = $page.url.pathname;
		let redirectTo = $session.user
			? openRoutes.includes(currentPath)
				? '/'
				: null
			: !openRoutes.includes(currentPath)
			  ? '/welcome'
			  : null;

		if (redirectTo) {
			goto(redirectTo);
		}
	}

	$resourcesList;
	$growRunsStore;
	session.set({ user: null, loading: true });

	// a fixed loading time so animation can be enjoyed :)
	let minLoadingDone = false;
	setTimeout(() => {
		minLoadingDone = true;
	}, 1500);
</script>

{#if $session.loading || !minLoadingDone}
	<div class="flex flex-col items-center">
		<h1>Loading... 🙂</h1>
		<img src={loadingAnimation} alt="plant growing animation" />
	</div>
{:else}
	{#if $session.user}
		<div class="flex justify-between flex-wrap bg-gray-800 items-center p-4 text-white">
		<Menu />
			<div class="flex gap-[15px] items-center">
				<p class="hidden md:block">
					Logged in: <span class="font-bold">{$session.user.email}</span>
				</p>
				<a href="/logout" class="nav-item">Logout</a>
			</div>
		</div>
	{/if}
	<div class="p-2">
	<slot />
	</div>
{/if}
