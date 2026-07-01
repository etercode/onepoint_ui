import { getCatalogMenu, getCategories, getCollections } from '$lib/api/client';

export async function load() {
	try {
		const [categoriesRes, collectionsRes, menu] = await Promise.all([
			getCategories(),
			getCollections(),
			getCatalogMenu().catch(() => null)
		]);

		return {
			navCategories: categoriesRes.items,
			navCollections: collectionsRes.items,
			catalogMenu: menu
		};
	} catch (e) {
		console.error('Store layout: failed to load catalog nav', e);
		return {
			navCategories: [],
			navCollections: [],
			catalogMenu: null,
			apiUnavailable: true
		};
	}
}
