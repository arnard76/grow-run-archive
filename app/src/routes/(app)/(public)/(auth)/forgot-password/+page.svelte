<script lang="ts">
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '$features/user/auth';
	import type { FirebaseError } from 'firebase/app';

	const successMessage =
		'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.';

	let username: string;
	let loading = false;
	let error: string | boolean;

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		loading = true;
		try {
			await sendPasswordResetEmail($auth, username, {
				url: `http://localhost:5173/confirm-password-reset`
			});
			error = false;
		} catch (e) {
			error = (e as FirebaseError).message;
		}
		loading = false;
	};
</script>

<h1>Forgot your password</h1>
<form>
	{#if !loading}
		{#if error === false}
			<p style="color: green;">{successMessage}</p>
		{:else if error}
			<p style="color: red;">{error}</p>
		{/if}
	{/if}

	<div>
		<label for="username-input"><b>Username</b></label>
		<input type="text" placeholder="Enter Username" bind:value={username} required />
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<button on:click={submitHandler}>Send Reset Password Message</button>
	{/if}

	<p>
		Remember your password? <a href="/login">Login</a>
	</p>
	<p>
		Don't have any account yet? <a href="/sign-up">Sign-up</a>
	</p>
</form>
