<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$features/user/auth';
	import { session } from '$features/user/session';
	import { isValidPassword } from '$features/user/auth';
	import { userActionNames } from '@grow-run-archive/definitions';

	let email: string, password: string, confirmPassword: string;
	let error: string;

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		$session.loading = true;

		if (password != confirmPassword) {
			return (error = "confirm password doesn't match password!");
		}
		if (!isValidPassword(password)) return (error = 'password is not valid.');

		try {
			await createUserWithEmailAndPassword($auth, email, password);
		} catch (e) {
			error = (e as Error).message;
			$session.loading = false;
		}
	};
</script>

<h1>Sign-up</h1>
<form>
	{#if error}
		<p>{error}</p>
	{/if}

	<div>
		<label for="sign-up-username"><b>Username</b></label>
		<input
			type="text"
			id="sign-up-username"
			placeholder="Enter Username"
			bind:value={email}
			required
		/>
	</div>

	<div>
		<label for="sign-up-password"><b>Password</b></label>
		<input
			type="password"
			id="sign-up-password"
			placeholder="Enter Password"
			bind:value={password}
			required
		/>
	</div>

	<div>
		<label for="sign-up-confirm-password"><b>Confirm Password</b></label>
		<input
			type="password"
			id="sign-up-confirm-password"
			placeholder="Confirm Password"
			bind:value={confirmPassword}
			required
		/>
	</div>
	<button on:click={submitHandler}>{userActionNames.signup}</button>

	<p>
		Already have an account? <a href="/login">Login</a>
	</p>
</form>
