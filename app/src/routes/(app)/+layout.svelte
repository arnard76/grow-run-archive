<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { session } from '$features/user/session';

	import Menu from '$lib/components/Menu.svelte';
	import { page } from '$app/stores';
	import { initializeFirebase } from '$lib/firebase';

	import '$lib/styles/global.css';
	import Loading from '$lib/components/Loading.svelte';
	import { growRuns, growRunsLoading } from '$features/grow-runs/grow-run/store';
	import { resourcesList, resourcesLoading } from '$features/resources/store';
	import { auth } from '$features/user/auth';
	import AuthMenu from '$lib/components/AuthMenu.svelte';

	$: if (browser) initializeFirebase();

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

		if (redirectTo) goto(redirectTo);
	}

	session.set({ user: null, loading: true });
	$auth;
	$resourcesList;
	$growRuns;
</script>

<Loading loading={$session.loading || $growRunsLoading || $resourcesLoading}>
	{#if $session.user}
		<div
			class="flex justify-between flex-wrap bg-gray-800 items-center p-4 text-white relative z-10"
		>
			<Menu />

			<AuthMenu />
		</div>
	{/if}
	<slot />
</Loading>
