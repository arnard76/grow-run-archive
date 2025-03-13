<script lang="ts">
	import { confirmPasswordReset } from 'firebase/auth';
	import { page } from '$app/stores';
	import { auth } from '$lib/user/auth';
	import { isValidPassword } from '$lib/user/auth';

	const successMessage = 'Your password has been reset! <a href="/login">Try logging in</a>';
	const resetCode = $page.url.searchParams.get('oobCode');
	let newPassword: string, confirmNewPassword: string;
	let error: any,
		loading = false;

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		loading = true;

		if (!resetCode || !newPassword) return (error = 'reset code or new password is empty.');

		if (newPassword != confirmNewPassword)
			return (error = "password doesn't match confirm password");

		if (!isValidPassword(newPassword)) return (error = 'not valid password');

		try {
			await confirmPasswordReset($auth, resetCode, newPassword);
			error = false;
		} catch (e) {
			error = (e as Error).message;
		}

		loading = false;
	};
</script>

<h1>Set new password</h1>
<form>
	{#if !loading}
		{#if error === false}
			<p style="color: green;">{@html successMessage}</p>
		{:else if error}
			<p style="color: red;">{error}</p>
		{/if}
	{/if}

	<div class="container">
		<label for="new-password"><b>New password</b></label>
		<input type="password" placeholder="Enter new password" bind:value={newPassword} required />

		<label for="confirm-new-password"><b>Confirm new password</b></label>
		<input
			type="password"
			placeholder="Confirm new password"
			bind:value={confirmNewPassword}
			required
		/>

		{#if loading}
			<p>Loading...</p>
		{:else}
			<button on:click={submitHandler}>Submit</button>
		{/if}
	</div>
</form>
