<script lang="ts">
	import { browser } from '$app/environment';
	import { auth } from '$lib/firebase';
	import { session } from '$lib/firebase/user';
	import { signOut } from 'firebase/auth';

	let error: string;

	console.log('here in logout');
	if (browser && $session.user) {
		console.log('setting loading true');
		$session.loading = true;
		signOut(auth).catch((reason) => {
			$session.loading = false;
			error = reason;
		});
		// $session.user = null;
		// $session.loading = false;
	}
</script>

{#if error}
	<p>{error}</p>{/if}
