<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let paramValue: any = {};

	$: if (browser) {
		const url = $page.url.href;
		console.log({ url });

		const b = new URLSearchParams(url.split('#')[1]);
		b.forEach((value, key) => {
			console.log({ value, key });
			paramValue[key] = value;
		});
		console.log({ paramValue });

		localStorage.setItem('photos_access_token', paramValue.access_token);
		goto('/photos');
	}
</script>
