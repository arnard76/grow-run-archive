<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/user/auth';
	import { session } from '$lib/user/user';
	import { isValidPassword } from '$lib/user/auth';

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
	<div class="container">
		<label for="sign-up-username"><b>Username</b></label>
		<input
			type="text"
			id="sign-up-username"
			placeholder="Enter Username"
			bind:value={email}
			required
		/>

		<label for="sign-up-password"><b>Password</b></label>
		<input
			type="password"
			id="sign-up-password"
			placeholder="Enter Password"
			bind:value={password}
			required
		/>

		<label for="sign-up-confirm-password"><b>Confirm Password</b></label>
		<input
			type="password"
			id="sign-up-confirm-password"
			placeholder="Confirm Password"
			bind:value={confirmPassword}
			required
		/>
		<button on:click={submitHandler}>Submit</button>

		<!-- Sign up with:
		<button on:click={() => {}}>Google</button> -->
	</div>

	<p>Already have an account? <a href="/login">Login</a></p>
</form>
