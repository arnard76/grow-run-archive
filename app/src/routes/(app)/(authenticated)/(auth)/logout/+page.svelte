<script lang="ts">
	import { browser } from '$app/environment';
	import { auth } from '$lib/user/auth';
	import { session } from '$lib/user/user';
	import { signOut } from 'firebase/auth';

	let error: string;

	if (browser && $session.user) {
		$session.loading = true;
		signOut($auth).catch((reason) => {
			$session.loading = false;
			error = reason;
		});
	}
</script>

{#if error}
	<p>{error}</p>{/if}
