<script lang="ts">
	import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { userActionNames } from '@grow-run-archive/definitions';
	import { session } from './session';
	import * as firebase from 'firebase/database';
	import { db } from '$lib/database';

	export let closeModal: () => any;

	let error: any,
		loading = false,
		confirmAction: string;

	const submitHandler = async () => {
		const actionPromptValidator = new RegExp('delete .* password .*');

		if (!$session.user || !$session.user.email) return (error = 'User is not signed in');
		if (!actionPromptValidator.test(confirmAction)) return (error = 'Prompt is incorrect');
		if (!$db) return (error = 'Database is not defined');

		loading = true;

		try {
			const credential = EmailAuthProvider.credential(
				confirmAction.split('delete ')[1].split(' password ')[0],
				confirmAction.split(' password ')[1]
			);
			await reauthenticateWithCredential($session.user, credential);
			await firebase.remove(firebase.ref($db, `/${$session.user.uid}`));
			await deleteUser($session.user);
			error = false;
		} catch (e) {
			error = (e as Error).message;
		}

		loading = false;
	};
</script>

{#if $session.user?.email}
	<ActionTemplate
		actionName={userActionNames.deleteUser($session.user.email)}
		onCancel={closeModal}
		onComplete={submitHandler}
	>
		{#if !loading}
			{#if error === false}
				<p class="text-green-500">Your password has changed!</p>
			{:else if error}
				<p class="text-red-500">{error}</p>
			{/if}
		{/if}

		<div class="container">
			<label for="confirm-delete-action">
				Type "delete {'<your username here>'}
				{'<your password here>'}"
			</label>
			<input id="confirm-delete-action" type="text" bind:value={confirmAction} required />

			{#if loading}
				<p>Loading...</p>
			{/if}
		</div>
	</ActionTemplate>
{/if}
