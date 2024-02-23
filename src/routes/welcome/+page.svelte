<script lang="ts">
	let emailAddressInput: HTMLInputElement | undefined;
	let signUpRequestResult: HTMLHeadingElement | undefined;
	let signUpRequestForm: HTMLFormElement | undefined;

	async function requestASignUp(event: SubmitEvent) {
		event.preventDefault();

		const res = await fetch('/sign-up-request', {
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
	<h2>Features</h2>
	<ul>
		<li>Stores all of your grow runs</li>
		<li>Displays the cost of each grow run and cost per unit</li>
		<li>Shows how the cost is split among the resources that were used</li>
		<li>Stores conditions related to the grow e.g. temperature, pH</li>
	</ul>

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
</main>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
	href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
	rel="stylesheet"
/>
<link rel="stylesheet" href="/style.css" />
