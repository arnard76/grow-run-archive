<script lang="ts">
	import { browser } from '$app/environment';
	import { session } from '$lib/user/user';
	import type Resource from '$features/resource';
	import { resourcesList } from '$features/resource/store';
	import { getBlob, getStorage, ref } from 'firebase/storage';

	export let data;

	$: fullData = resourcesList.getResource(data.resourceName);
	$: ({ name, productLink } = fullData as Resource);

	let photo: Blob | undefined;

	$: if (browser) {
		getBlob(
			ref(getStorage(), `${$session.user?.uid}/product-page-archive/${data.resourceName}.jpg`)
		).then((res) => (photo = res));
	}
</script>

{name}
<a href={productLink} target="_blank">
	{#if photo}
		<img src={URL.createObjectURL(photo)} alt="product page" width="150" />
	{:else}
		Go to product page
	{/if}
</a>
