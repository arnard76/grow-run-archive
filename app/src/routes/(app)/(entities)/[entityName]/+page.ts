import { entities } from '$lib/entities';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entity = entities.find((entity) => entity.names.URL === params.entityName);
	if (!entity) return redirect(301, `/`);
	return { entity };
};
