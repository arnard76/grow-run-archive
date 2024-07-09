<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { session } from '$lib/firebase/user';
	import type { FirebaseError } from 'firebase/app';

	let email: string, password: string;
	let error: string;

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		$session.loading = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (e) {
			error = (e as FirebaseError).message;
			$session.loading = false;
		}
	};
</script>

<h1>Login</h1>
<form>
	{#if error}
		<p>{error}</p>
	{/if}
	<div class="container">
		<label for="uname"><b>Username</b></label>
		<input type="text" placeholder="Enter Username" bind:value={email} required />

		<label for="psw"><b>Password</b></label>
		<input type="password" placeholder="Enter Password" bind:value={password} required />

		<Button on:click={submitHandler}>Submit</Button>

		<!-- Sign in with:
		<Button on:click={() => {}}>Google</Button> -->
	</div>

	<a href="/forgot-password">Forgot password</a>
	<p>Don't have an account? <a href="/sign-up">Sign-up</a></p>
</form>
