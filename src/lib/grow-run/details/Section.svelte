<script lang="ts">
	import type GrowRun from '$lib/grow-run/growRun';
	import { uploadGrowSetupPhotos, downloadGrowSetupPhotos } from '$lib/grow-run/photoStorage';
	import NameDetails from './NameDetails.svelte';
	import DurationDetails from './duration/Section.svelte';
	export let growRun: GrowRun;

	let growSetupPhotos: any[] = [];

	downloadGrowSetupPhotos(growRun).then((res) => (growSetupPhotos = res));
</script>

<h4>Details</h4>

<!-- Photos -->
{#if growSetupPhotos.length}
	<div class="grow-setup-photos">
		{#each growSetupPhotos as photo}
			<img src={URL.createObjectURL(photo)} alt="bleh" />
		{/each}
	</div>
{/if}

<div>
	<input
		type="file"
		name=""
		id=""
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

<NameDetails {growRun} />

<DurationDetails {growRun} />

<style>
	.grow-setup-photos {
		border: 3px solid green;
		display: flex;
		width: fit-content;
		align-items: center;
		gap: 5px;
		padding: 5px;
	}

	.grow-setup-photos img {
		width: 100px;
	}
</style>
