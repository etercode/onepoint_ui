import { getCategories, getCollections } from '$lib/api/client';

export async function load() {
	const [categoriesRes, collectionsRes] = await Promise.all([
		getCategories(),
		getCollections()
	]);

	return {
		navCategories: categoriesRes.items,
		navCollections: collectionsRes.items
	};
}
