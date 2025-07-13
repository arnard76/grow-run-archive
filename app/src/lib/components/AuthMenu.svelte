<script lang="ts">
	import Icon from '@iconify/svelte';
	import MenuDropDown from './MenuDropDown.svelte';
	import { session } from '$features/user/session';
	import { userActionNames } from '@grow-run-archive/definitions';
</script>

<nav>
	<MenuDropDown>
		<p class="nav-item" slot="text" title={userActionNames.openMenu}>
			<Icon icon="tabler:user-circle" />
		</p>
		<p class="hidden md:block">
			Logged in as
			<span class="font-bold">{$session.user?.email}</span>
		</p>
		<a href="/settings" class="flex gap-2 items-center">
			<Icon icon="tabler:settings" /> Settings
		</a>
		<a href="/logout">Logout</a>
	</MenuDropDown>
</nav>
