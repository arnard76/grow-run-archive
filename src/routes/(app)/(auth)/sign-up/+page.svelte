<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { session } from '$lib/firebase/user';
	import { isValidPassword } from '$lib/firebase/auth';

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
			await createUserWithEmailAndPassword(auth, email, password);
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
		<label for="uname"><b>Username</b></label>
		<input type="text" placeholder="Enter Username" bind:value={email} required />

		<label for="psw"><b>Password</b></label>
		<input type="password" placeholder="Enter Password" bind:value={password} required />

		<label for="psw"><b>Confirm Password</b></label>
		<input type="password" placeholder="Confirm Password" bind:value={confirmPassword} required />
		<button on:click={submitHandler}>Submit</button>

		<!-- Sign up with:
		<button on:click={() => {}}>Google</button> -->
	</div>

	<p>Already have an account? <a href="/login">Login</a></p>
</form>
