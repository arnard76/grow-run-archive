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

	$: if (browser && $session) {
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
</script>

{#if $session.loading}
	<div style="position:absolute; top:0;">
		<div>Loading...</div>
		<img src={loadingAnimation} alt="plant growing animation" />
	</div>
{:else if $session.user}
	<p>
		Logged in: {$session.user.email}
	</p>
	<Menu />
{/if}
<slot />
