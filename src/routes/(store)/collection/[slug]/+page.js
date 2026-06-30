import { ApiClientError, getCollection, getCollections, getProducts } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ params }) {
	try {
		const [collection, collectionsRes, productsRes] = await Promise.all([
			getCollection(params.slug),
			getCollections(),
			getProducts({ collection: params.slug })
		]);

		return {
			collection,
			collections: collectionsRes.items,
			products: productsRes.items
		};
	} catch (e) {
		if (e instanceof ApiClientError && e.status === 404) {
			return { collection: null, collections: [], products: [] };
		}
		console.error('Collection: failed to load', params.slug, e);
		return { collection: null, collections: [], products: [], apiUnavailable: true };
	}
}
