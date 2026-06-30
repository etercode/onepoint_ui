import { getCategories, getCollections, getProducts } from '$lib/api/client';

export async function load() {
	try {
		const [featured, newest, categories, collections] = await Promise.all([
			getProducts({ limit: 24 }),
			getProducts({ isNew: true, limit: 12 }),
			getCategories(),
			getCollections({ featured: true })
		]);

		return {
			featuredProducts: featured.items,
			newestProducts: newest.items,
			categories: categories.items,
			collections: collections.items
		};
	} catch (e) {
		console.error('Home: failed to load catalog', e);
		return {
			featuredProducts: [],
			newestProducts: [],
			categories: [],
			collections: [],
			apiUnavailable: true
		};
	}
}
