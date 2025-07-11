<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$features/user/auth';
	import { session } from '$features/user/session';
	import type { FirebaseError } from 'firebase/app';
	import { userActionNames } from '@grow-run-archive/definitions';

	let email: string, password: string;
	let error: string;

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		$session.loading = true;
		try {
			await signInWithEmailAndPassword($auth!, email, password);
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
	<div>
		<label for="login-username"><b>Username</b></label>
		<input
			type="text"
			id="login-username"
			placeholder="Enter Username"
			bind:value={email}
			required
		/>
	</div>

	<div>
		<label for="login-password"><b>Password</b></label>
		<input
			type="password"
			id="login-password"
			placeholder="Enter Password"
			bind:value={password}
			required
		/>
	</div>

	<button on:click={submitHandler} disabled={$session.loading}>{userActionNames.login}</button>

	<a href="/forgot-password">Forgot your password?</a>
	<p>
		Don't have an account? <a href="/sign-up">Sign-up</a>
	</p>
</form>
