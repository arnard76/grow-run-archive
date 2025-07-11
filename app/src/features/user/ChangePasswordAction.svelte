<script lang="ts">
	import { updatePassword } from 'firebase/auth';
	import { isValidPassword } from '$features/user/auth';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { userActionNames } from '@grow-run-archive/definitions';
	import { session } from './session';

	export let closeModal: () => any;

	let newPassword: string, confirmNewPassword: string;
	let error: any,
		loading = false;

	const submitHandler = async () => {
		loading = true;

		if (!$session.user || !newPassword) return (error = 'reset code or new password is empty.');

		if (newPassword != confirmNewPassword)
			return (error = "password doesn't match confirm password");

		if (!isValidPassword(newPassword)) return (error = 'not valid password');

		try {
			await updatePassword($session.user, newPassword);
			error = false;
		} catch (e) {
			error = (e as Error).message;
		}

		loading = false;
	};
</script>

<ActionTemplate
	actionName={userActionNames.changePassword}
	onCancel={closeModal}
	onComplete={() => submitHandler()}
>
	{#if !loading}
		{#if error === false}
			<p class="text-green-500">Password has changed!</p>
		{:else if error}
			<p class="text-red-500">{error}</p>
		{/if}
	{/if}

	<div class="container">
		<label for="new-password">New password</label>
		<input type="password" placeholder="Enter new password" bind:value={newPassword} required />

		<label for="confirm-new-password">Confirm new password</label>
		<input
			type="password"
			placeholder="Confirm new password"
			bind:value={confirmNewPassword}
			required
		/>

		{#if loading}
			<p>Loading...</p>
		{/if}
	</div>
</ActionTemplate>
