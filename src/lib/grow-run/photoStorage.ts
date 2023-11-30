import { uploadBytes, ref, getStorage, list, getBlob } from 'firebase/storage';
import type GrowRun from '$lib/grow-run/growRun';

const storage = getStorage();

export async function uploadGrowSetupPhotos(growRun: GrowRun, files: File[]) {
	return await Promise.all(
		files.map((file) =>
			uploadBytes(ref(storage, `grow-setup-photos/${growRun.name}/${file.name}`), file)
		)
	);
}

export async function downloadGrowSetupPhotos(growRun: GrowRun) {
	const allPhotos = await list(ref(storage, `grow-setup-photos/${growRun.name}/`));

	if (!allPhotos.items.length) return [];
	return await Promise.all(allPhotos.items.map((photo) => getBlob(photo)));
}
