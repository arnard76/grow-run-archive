<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { session } from '$lib/user/user';

	import Menu from '$lib/components/Menu.svelte';
	import { page } from '$app/stores';
	import { initializeFirebase } from '$lib/firebase';
	import { onDestroy } from 'svelte';

	import '$lib/styles/global.css';
	import Loading from '$lib/components/Loading.svelte';
	import { growRuns, growRunsLoading } from '$features/grow-run/store';
	import { resourcesList, resourcesLoading } from '$features/resource/store';

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

	session.set({ user: null, loading: true });
	$resourcesList;
	$growRuns;
</script>

<Loading loading={$session.loading || $growRunsLoading || $resourcesLoading}>
	{#if $session.user}
		<div
			class="flex justify-between flex-wrap bg-gray-800 items-center p-4 text-white relative z-10"
		>
			<Menu />
			<div class="flex gap-[15px] items-center">
				<p class="hidden md:block">
					Logged in: <span class="font-bold">{$session.user.email}</span>
				</p>
				<a href="/logout" class="nav-item">Logout</a>
			</div>
		</div>
	{/if}
	<slot />
</Loading>
