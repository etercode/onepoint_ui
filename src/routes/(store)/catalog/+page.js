import { getProducts } from '$lib/api/client';

export async function load() {
	try {
		const { items } = await getProducts();
		return { products: items };
	} catch (e) {
		console.error('Catalog: failed to load products', e);
		return { products: [], apiUnavailable: true };
	}
}
