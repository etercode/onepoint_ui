import { getCategories, getCollections } from '$lib/api/client';

export async function load() {
	try {
		const [categoriesRes, collectionsRes] = await Promise.all([
			getCategories(),
			getCollections()
		]);

		return {
			navCategories: categoriesRes.items,
			navCollections: collectionsRes.items
		};
	} catch (e) {
		console.error('Store layout: failed to load catalog nav', e);
		return {
			navCategories: [],
			navCollections: [],
			apiUnavailable: true
		};
	}
}
