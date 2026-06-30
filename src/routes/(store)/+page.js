import { getCategories, getCollections, getProducts } from '$lib/api/client';

export async function load() {
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
}
