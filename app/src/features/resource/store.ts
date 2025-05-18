import { EntityAPI } from '$lib/abstract-entity/api';
import { createEntityStores as createEntityStore } from '$lib/abstract-entity/store';
import Resource from '$features/resource';
import { session } from '$lib/user/user';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref as storageRef,
	uploadBytes
} from 'firebase/storage';
import { get } from 'svelte/store';

const noResourceFound = {
	id: 'noid',
	name: 'RESOURCE NOT FOUND',
	productLink: '#noproductlink',
	cost: 100,
	amountType: 'mass',
	amountUnit: 'g',
	amountTotal: 100,
	colour: 'black',
	notes: ''
};

export const resourcesAPI = new EntityAPI<Resource>('resource-list', 'id');

const { loading, records: resourcesStore } = createEntityStore(Resource, resourcesAPI);

export const resourcesLoading = loading;

export const resourcesList = {
	...resourcesStore,

	async archiveProductPageForResource({ productLink, name }: Resource) {
		if (!productLink) return;
		// if (!productLink) throw Error('The url for the product page to be archived is missing.');

		const queryParams = new URLSearchParams({
			access_key: 'EPiZSx745qtheA',
			url: productLink,
			viewport_width: '1920',
			viewport_height: '1280',
			device_scale_factor: '1',
			image_quality: '80',
			format: 'jpg',
			block_ads: 'true',
			block_cookie_banners: 'true',
			full_page: 'true',
			block_trackers: 'true',
			block_banners_by_heuristics: 'false',
			delay: '0',
			timeout: '60'
		});

		const screenshotApiResponse = await fetch('https://api.screenshotone.com/take?' + queryParams);

		if (screenshotApiResponse.status != 200)
			throw Error(
				"couldn't screenshot product page: " +
					productLink +
					'\nbecause: ' +
					(await screenshotApiResponse.text())
			);

		const arrayBuffer = await screenshotApiResponse.arrayBuffer();

		// save screenshot to files to firebase storage
		const screenshotPathRef = storageRef(
			getStorage(),
			`${get(session)?.user?.uid}/product-page-archive/${name}.jpg`
		);

		try {
			await getDownloadURL(screenshotPathRef);
			await deleteObject(screenshotPathRef);
		} catch (e) {
		} finally {
			await uploadBytes(screenshotPathRef, arrayBuffer);
		}
	},

	async unarchiveProductPageForResource({ name }: Resource) {
		const screenshotPathRef = storageRef(
			getStorage(),
			`${get(session)?.user?.uid}/product-page-archive/${name}.jpg`
		);

		await deleteObject(screenshotPathRef);
	},

	async addResource(resource: Resource) {
		resourcesAPI.add(resource);
		try {
			this.archiveProductPageForResource(resource);
		} catch (e) {
			console.error(e);
		}
	},

	// local array is always up to date with db so can get directly from hereo
	getResource(resourceName: string, resources?: Resource[]): Resource {
		const resource = (resources || get(this)).find(
			(resource: any) => resource.name === resourceName
		);

		return new Resource(resource || noResourceFound);
	},

	async editResource(resourceToEdit: Resource) {
		const resources = get(this);
		const index = resources.findIndex((resource) => resource.id === resourceToEdit.id);

		if (resources[index].productLink != resourceToEdit.productLink) {
			try {
				this.archiveProductPageForResource(resourceToEdit);
			} catch (e) {
				console.error(e);
			}
		}

		resourcesAPI.updateFull(resourceToEdit);
	},

	async removeResource(resourceToDelete: Resource) {
		resourcesAPI.delete(resourceToDelete.id);

		try {
			await this.unarchiveProductPageForResource(resourceToDelete);
		} catch (e) {
			console.error(e);
		}
	}
};
