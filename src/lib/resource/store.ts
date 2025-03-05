import { derived, get } from 'svelte/store';
import Resource from '$lib/resource';
import { push, ref, set, onValue } from 'firebase/database';
import { session } from '$lib/user/user';
import {
	getStorage,
	uploadBytes,
	ref as storageRef,
	getDownloadURL,
	deleteObject
} from 'firebase/storage';
import { db } from '$lib/database';

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

type databaseResourceListObject = {
	[key: string]: any;
};

export const resourcesList = {
	...derived(
		[session, db],
		([{ user }, $db], storeSet) => {
			storeSet([]);

			if (!user?.uid) return;

			const resourcesListRef = ref($db, `${user.uid}/resource-list/`);

			return onValue(resourcesListRef, (snapshot) => {
				const data = resourcesList.convertDbObjToArray(snapshot.val());
				storeSet(data);
			});
		},
		[] as Resource[]
	),

	async updateResourcesListOnDb(resources?: Resource[]) {
		const { user } = get(session);
		if (!user?.uid) return;

		const resourcesListRef = ref(db, `${user.uid}/resource-list/`);

		await set(resourcesListRef, this.convertArrayToDbObj(resources));
	},

	convertDbObjToArray(data: databaseResourceListObject): Resource[] {
		return Object.entries(data || {}).map(
			([id, resource]: [string, any]) => new Resource({ id, ...resource })
		);
	},

	convertArrayToDbObj(resources?: Resource[]): databaseResourceListObject {
		const dbObject: databaseResourceListObject = {};
		for (let resource of resources || get(this)) {
			dbObject[resource.id] = { ...resource, id: undefined };
			delete dbObject[resource.id].id;
		}
		return dbObject;
	},

	async archiveProductPageForResource({ productLink, name }: Resource) {
		if (!productLink) throw Error('The url for the product page to be archived is missing.');

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
		const { user } = get(session);
		if (!user?.uid) return;

		const resourcesListRef = ref(db, `${user.uid}/resource-list/`);

		const newResourceRef = push(resourcesListRef);
		await set(newResourceRef, resource);
		this.archiveProductPageForResource(resource);
	},

	// local array is always up to date with db so can get directly from here
	getResource(resourceName: string, resources?: Resource[]): Resource {
		const resource = (resources || get(this)).find(
			(resource: any) => resource.name === resourceName
		);

		return new Resource(resource || noResourceFound);
	},

	async editResource(resourceToEdit: Resource) {
		const resources = get(this);
		const index = resources.findIndex((resource) => resource.id === resourceToEdit.id);

		if (resources[index].productLink != resourceToEdit.productLink)
			this.archiveProductPageForResource(resourceToEdit);

		resources[index] = resourceToEdit;
		await this.updateResourcesListOnDb(resources);
	},

	async removeResource(resourceToDelete: Resource) {
		const resources = get(this);
		const index = resources.findIndex((resource) => resource.id === resourceToDelete.id);
		resources.splice(index, 1);
		await this.updateResourcesListOnDb(resources);

		await this.unarchiveProductPageForResource(resourceToDelete);
	}
};
