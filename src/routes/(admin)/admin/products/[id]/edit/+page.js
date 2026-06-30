import { ApiClientError, getCategories, getCollections, getProduct } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id < 1) {
		return { product: null, categories: [], collections: [] };
	}

	try {
		const [product, categoriesRes, collectionsRes] = await Promise.all([
			getProduct(id),
			getCategories(),
			getCollections()
		]);
		return {
			product,
			categories: categoriesRes.items ?? [],
			collections: collectionsRes.items ?? []
		};
	} catch (e) {
		if (e instanceof ApiClientError && e.status === 404) {
			return { product: null, categories: [], collections: [] };
		}
		console.error('Admin product edit: failed to load', id, e);
		return { product: null, categories: [], collections: [], apiUnavailable: true };
	}
}
