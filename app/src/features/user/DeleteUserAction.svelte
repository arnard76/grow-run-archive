<script lang="ts">
	import { deleteUser } from 'firebase/auth';
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
		if (!$session.user) return (error = 'User is not signed in');
		if (confirmAction !== `delete ${$session.user?.email}`)
			return (error = 'Please type the command correctly.');
		if (!$db) return (error = 'Database is not defined');

		loading = true;

		try {
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
			<label for="confirm-delete-action">Type "delete {$session.user.email}"</label>
			<input id="confirm-delete-action" type="text" bind:value={confirmAction} required />

			{#if loading}
				<p>Loading...</p>
			{/if}
		</div>
	</ActionTemplate>
{/if}
