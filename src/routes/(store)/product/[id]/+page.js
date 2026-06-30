import { ApiClientError, getProduct, getRelatedProducts } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id < 1) {
		return { product: null, related: [] };
	}

	try {
		const [product, relatedRes] = await Promise.all([
			getProduct(id),
			getRelatedProducts(id)
		]);

		return {
			product,
			related: relatedRes.items
		};
	} catch (e) {
		if (e instanceof ApiClientError && e.status === 404) {
			return { product: null, related: [] };
		}
		console.error('Product: failed to load', id, e);
		return { product: null, related: [], apiUnavailable: true };
	}
}
