<script lang="ts">
	import type GrowRun from '../..';
	import {
		uploadGrowSetupPhotos,
		downloadGrowSetupPhotos
	} from '$features/grow-runs/grow-run/details/photos/photoStorage';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let growRun: GrowRun;
	export let closeModal: () => any;

	let growSetupPhotos: any[] = [];
	let newGrowSetupPhotos: any[] = [];

	downloadGrowSetupPhotos(growRun).then((res) => (growSetupPhotos = res));
</script>

<!-- <Action actionName={growRunActionNames.manageImages}> -->
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

			const uploadResult = await uploadGrowSetupPhotos(growRun, filesList);
			console.log(uploadResult);

			growSetupPhotos = await downloadGrowSetupPhotos(growRun);
			closeModal();
		}}
	/>
</div>
<CancelButton on:click={closeModal} />

<!-- show preview? -->
<!-- </Action> -->
