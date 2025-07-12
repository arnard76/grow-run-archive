<script lang="ts">
	import '$lib/styles/global.css';
	import { API_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';

	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from 'svelte-vertical-timeline';

	const options = [{ time: 'July 2025' }, { time: 'July 2024' }];

	let emailAddressInput: HTMLInputElement | undefined;
	let signUpRequestResult: HTMLHeadingElement | undefined;
	let signUpRequestForm: HTMLFormElement | undefined;

	async function requestASignUp(event: SubmitEvent) {
		event.preventDefault();

		const res = await fetch(`${API_URL}/sign-up-request`, {
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

<div class="flex flex-col sm:flex-row sm:h-screen max-w-screen overflow-hidden text-wrap">
	<div class="p-16 m-auto">
		<a href="/login">
			<img
				src="plant-growing-logo.webp"
				alt="LOGO: plant growing animation"
				width="100"
				class="rounded-lg"
				loading="lazy"
			/>
		</a>
	</div>

	<main class="sm:overflow-y-auto p-0 bg-blue-600">
		<section class="p-8 text-pretty spacing bg-blue-100">
			<h2>Purpose of this app</h2>
			<p>
				A place to record things about a farm or a garden, including: harvest results, resource
				usage and environmental conditions.
			</p>
			<br />
			<p>
				The app provides simple summaries, such as: total cost, total cost per unit, total harvested
			</p>
		</section>

		<section class="bg-blue-400 p-8 text-white">
			<h2>Sign up</h2>
			<form bind:this={signUpRequestForm} on:submit={requestASignUp}>
				<div class="flex flex-col items-start sm:block">
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

		<section class="text-white">
			<figure class="p-8 bg-blue-600 text-white">
				<h2>Video Demo</h2>
				<div class="sm:w-3/4 m-auto">
					<video muted controls autoplay loop class="max-w-full max-h-full">
						<source src="demo-videos/July 2025.webm" />
					</video>
				</div>
			</figure>

			<Timeline position="alternate" style="mt-32">
				{#each options as option, i}
					<TimelineItem style="height: 12rem;">
						<TimelineOppositeContent slot="opposite-content">
							<video
								muted
								controls
								loop
								class="max-w-full max-h-full sm:w-1/2 hover:scale-105 transition-transform -translate-y-1/2
								{i === 0 ? 'invisible' : ''}"
							>
								<source src="demo-videos/{option.time}.webm" />
							</video>
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>
							<p>{option.time}</p>
						</TimelineContent>
					</TimelineItem>
				{/each}
			</Timeline>
		</section>
	</main>
</div>
