import { getCategories, getCollections } from '$lib/api/client';

export async function load() {
	try {
		const [categoriesRes, collectionsRes] = await Promise.all([
			getCategories(),
			getCollections()
		]);
		return {
			categories: categoriesRes.items ?? [],
			collections: collectionsRes.items ?? []
		};
	} catch (e) {
		console.error('Admin product form: failed to load options', e);
		return { categories: [], collections: [], apiUnavailable: true };
	}
}
