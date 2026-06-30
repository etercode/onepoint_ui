import { getProducts } from '$lib/api/client';

export async function load() {
	try {
		const { items } = await getProducts();
		return { products: items ?? [] };
	} catch (e) {
		console.error('Admin products: failed to load', e);
		return { products: [], apiUnavailable: true };
	}
}
