<script lang="ts">
	import '$lib/styles/global.css';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';

	let emailAddressInput: HTMLInputElement | undefined;
	let signUpRequestResult: HTMLHeadingElement | undefined;
	let signUpRequestForm: HTMLFormElement | undefined;

	async function requestASignUp(event: SubmitEvent) {
		event.preventDefault();

		const res = await fetch(`${PUBLIC_API_URL}/sign-up-request`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 'user-email': emailAddressInput?.value })
		});

		if (!signUpRequestForm || !emailAddressInput || !signUpRequestResult) return;

		if (res.status === 200) {
			signUpRequestForm.parentElement?.removeChild(signUpRequestForm);
			signUpRequestResult.innerText = 'Email address saved! Thanks for your interest.';
		} else {
			signUpRequestResult.innerText = await res.text();
		}
	}
</script>

<svelte:head>
	<title>Grow Run Archive - Store your farming results</title>
	<meta
		name="description"
		content="Grow Run Archive is a tool for storing your farming results and providing helpful summaries. Grow run simply means a period where the plants are growing and could include these stages: germinating, growing, harvests, season ending."
	/>
</svelte:head>

<div class="flex h-screen">
	<div class=" p-4 m-auto">
		<img
			loading="lazy"
			src="logos/png/logo-no-background.png"
			height="150px"
			alt="grow run archive logo"
		/>
	</div>

	<main class="overflow-y-auto p-0 bg-blue-100">
		<section class="p-8">
			<h2>Purpose of this app</h2>
			<p>Displays the following information for each grow run:</p>
			<ul>
				<li>total cost and cost per unit</li>
				<li>used resources (+ cost spent on these resources)</li>
				<li>data on environmental conditions such as temperature, soil pH and humidity</li>
			</ul>
		</section>

		<section class="bg-blue-400 p-8 text-white">
			<form bind:this={signUpRequestForm} on:submit={requestASignUp}>
				<h2 class="m-0">Sign up</h2>
				<div class="mb-8">
					<label for="signup-email-input">Email</label>
					<input
						type="email"
						bind:this={emailAddressInput}
						placeholder="e.g. name@gmail.com"
						id="signup-email-input"
					/>

					<button><Icon icon="tabler:check" /></button>
				</div>
			</form>
			<!-- svelte-ignore a11y-missing-content -->
			<p bind:this={signUpRequestResult}></p>
		</section>

		<figure class="p-8 bg-blue-600 text-white">
			<h2>July 2024 Demo</h2>
			<div class="w-1/2">
				<video muted controls autoplay loop class="max-w-full max-h-full">
					<source src="videos/Grow Run Archive - Demo 2024.webm" />
				</video>
			</div>
		</figure>
	</main>
</div>
