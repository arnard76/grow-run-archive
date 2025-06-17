import { uploadBytes, ref, list, getBlob } from 'firebase/storage';
import type GrowRun from '$features/grow-run';
import { storage } from '$lib/images/storage';
import { get } from 'svelte/store';

export async function uploadGrowSetupPhotos(growRun: GrowRun, files: File[]) {
	return await Promise.all(
		files.map((file) =>
			uploadBytes(ref(get(storage), `grow-setup-photos/${growRun.id}/${file.name}`), file)
		)
	);
}

export async function downloadGrowSetupPhotos(growRun: GrowRun) {
	const allPhotos = await list(ref(get(storage), `grow-setup-photos/${growRun.id}/`));

	if (!allPhotos.items.length) return [];
	return await Promise.all(allPhotos.items.map((photo) => getBlob(photo)));
}
