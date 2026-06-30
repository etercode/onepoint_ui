import { getCollections } from '$lib/api/client';

export async function load() {
	try {
		const { items } = await getCollections();
		return { collections: items ?? [] };
	} catch (e) {
		console.error('Admin collections: failed to load', e);
		return { collections: [], apiUnavailable: true };
	}
}
