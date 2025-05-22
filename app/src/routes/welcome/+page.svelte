<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';

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

<div class="logo">
	<img
		loading="lazy"
		src="logos/png/logo-no-background.png"
		height="150px"
		alt="grow run archive logo"
	/>
</div>

<main>
	<section>
		<h2>Features</h2>
		<div style="display: flex; flex-wrap: wrap; gap: 20px;">
			<div style="flex:1;min-width: 50%;max-width:100%;">
				<p style="margin-bottom: 10px;">Displays the following information for each grow run:</p>
				<ul>
					<li>total cost and cost per unit</li>
					<li>used resources (+ cost spent on these resources)</li>
					<li>data on environmental conditions such as temperature, soil pH and humidity</li>
				</ul>
			</div>
			<figure style="justify-content:start; flex: 1; min-width: 40rem; max-height: 30rem;">
				<div style="width: 100%; height: 90%; object-fit: contain;">
					<video
						muted
						autoplay
						loop
						style="max-width: 100%; border: 4px solid var(--accent-green); border-radius: 5px;max-height: 100%;"
					>
						<source src="videos/Grow Run Archive - Demo 2024.webm" />
					</video>
				</div>
				<figcaption>July 2024 Demo</figcaption>
			</figure>
		</div>
	</section>

	<section style="background-color: var(--accent-green)">
		<form bind:this={signUpRequestForm} on:submit={requestASignUp}>
			<h2 style="margin: 0;">Sign up</h2>
			<div class="input-container">
				<label
					>Email <input
						type="email"
						bind:this={emailAddressInput}
						placeholder="name@gmail.com"
					/></label
				>
				<button type="submit">
					<img width="30px" src="/tick-icon.png" alt="tick icon submit button" />
				</button>
			</div>
		</form>
		<!-- svelte-ignore a11y-missing-content -->
		<h3 bind:this={signUpRequestResult}></h3>
	</section>
</main>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<!-- <link
	href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
	rel="stylesheet"
/> -->
<link
	href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
	rel="stylesheet"
/>
<link rel="stylesheet" href="/style.css" />
