<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let growRunAlbum: any;
	let albumName: string;
	$: token = localStorage.getItem('photos_access_token');
	let images: any[];

	$: if (browser) {
		const token = localStorage.getItem('photos_access_token');
		if (!token) {
			goto('/photos/auth');
		} else {
			getAlbum(token).then(() => getImagesForGrowRunAlbum(token));
		}
	}

	async function getAlbum(access_token: string) {
		const b = await fetch(
			'https://photoslibrary.googleapis.com/v1/albums?' + new URLSearchParams({ access_token })
		);

		growRunAlbum = (await b.json()).albums.find((album: any) => album.title === 'aklgrow run');
	}

	async function createAlbum(access_token: string, albumName: string) {
		await fetch(
			'https://photoslibrary.googleapis.com/v1/albums?' + new URLSearchParams({ access_token }),
			{
				body: JSON.stringify({ album: { title: albumName } }),
				method: 'POST'
			}
		);
		await getAlbum(access_token);
	}

	async function uploadImagesForGrowRunAlbum(access_token: string, imageFiles: File[]) {
		let uploadTokens: { [key: number]: string } = {};
		await Promise.all(
			imageFiles.map(async (imageFile, index) => {
				const imageFileMimeType = imageFile.type;

				const uploadResponse = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${access_token}`,
						'Content-type': 'application/octet-stream',
						'X-Goog-Upload-Content-Type': imageFileMimeType,
						'X-Goog-Upload-Protocol': 'raw'
					},
					body: imageFile
				});

				uploadTokens[index] = await uploadResponse.text();
				console.log(index, imageFile.name, 'uploaded media');
			})
		);

		// 2nd step
		const upload2Body = {
			albumId: growRunAlbum.id,
			newMediaItems: imageFiles
				.map((imageFile, index) => {
					const uploadToken = uploadTokens[index];
					if (!uploadToken) return null;
					return {
						description: imageFile.name,
						simpleMediaItem: {
							fileName: imageFile.name,
							uploadToken
						}
					};
				})
				.filter((image) => image)
		};

		const upload2Response = await fetch(
			'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
			{
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify(upload2Body)
			}
		);

		const upload2Result = await upload2Response.text();
		console.log(upload2Result, upload2Response.status);
		await getImagesForGrowRunAlbum(access_token);

		// const imageIntoAlbumResponse = await fetch(
		// 	`https://photoslibrary.googleapis.com/v1/albums/${growRunAlbum.id}:batchAddMediaItems`,
		// 	{
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-type': 'application/json',
		// 			Authorization: `Bearer ${access_token}`
		// 		},
		// 		body: JSON.stringify({
		// 			mediaItemIds: Object.values(uploadTokens).filter((token) => token)
		// 		})
		// 	}
		// );

		// const imageIntoAlbumResult = await imageIntoAlbumResponse.text();
		// console.log(imageIntoAlbumResult, imageIntoAlbumResponse.status);
	}

	async function getImagesForGrowRunAlbum(access_token: string) {
		const imagesResponse = await fetch(
			'https://photoslibrary.googleapis.com/v1/mediaItems:search',
			{
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					albumId: growRunAlbum.id
				})
			}
		);

		const result = await imagesResponse.json();
		console.log({ result, status: imagesResponse.status });
		images = result.mediaItems.map((image: any) => {
			const { height, width } = image.mediaMetadata;
			return { ...image, link: `${image.baseUrl}=w${width}-h${height}` };
		});
	}
</script>

{#if token}
	<!-- ADD NEW ALBUM -->
	<!-- <input type="text" bind:value={albumName} placeholder="Album name" />
	<button on:click={() => createAlbum(token, albumName)}>Create album</button> -->

	{#if growRunAlbum}
		<h2>Grow Run Photos</h2>

		<a href={growRunAlbum.productUrl}>{growRunAlbum.title}</a>

		<!-- ADD PHOTOS -->

		<div class="my-4">
			<input
				type="file"
				multiple
				max=""
				on:change={async (e) => {
					const files = e.currentTarget.files;

					if (!files) return;

					console.log({ files });
					const filesList = [];
					let file;
					for (let fileIndexCounter = 0; fileIndexCounter < files.length; fileIndexCounter++) {
						file = files.item(fileIndexCounter);
						file && filesList.push(file);
					}

					const uploadResult = await uploadImagesForGrowRunAlbum(token, filesList);
					// const uploadResult = await thing(token);
					console.log(uploadResult);

					// growSetupPhotos = await downloadGrowSetupPhotos(growRun);
					// closeModal();
				}}
			/>
		</div>

		{#if images}
			{#each images as image (image.id)}
				<!-- BASEURL IS LOW QUALITY -->
				<img src={image.link} alt={image.description} width="500" />
			{/each}
		{/if}
	{/if}
{/if}
