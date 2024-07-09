<script lang="ts">
	import type GrowRun from '..';
	import {
		uploadGrowSetupPhotos,
		downloadGrowSetupPhotos
	} from '$lib/grow-run/details/photoStorage';

	export let growRun: GrowRun;
	let growSetupPhotos: any[] = [];

	downloadGrowSetupPhotos(growRun).then((res) => (growSetupPhotos = res));
</script>

<section>
	<!-- Photos -->
	{#if growSetupPhotos.length}
		<div class="grow-setup-photos">
			{#each growSetupPhotos as photo, i}
				<img
					src={URL.createObjectURL(photo)}
					alt={`photo #${i} for grow run with label: '${growRun.name}'`}
				/>
			{/each}
		</div>
	{/if}

	<div>
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

				const uploadResult = await uploadGrowSetupPhotos(growRun, filesList);
				console.log(uploadResult);

				growSetupPhotos = await downloadGrowSetupPhotos(growRun);
			}}
		/>
	</div>
</section>

<style>
	.grow-setup-photos {
		display: flex;
		width: 100%;
		overflow-x: auto;
		align-items: center;
		gap: 5px;
		padding: 5px;
	}

	.grow-setup-photos img {
		max-height: 200px;
	}
</style>
