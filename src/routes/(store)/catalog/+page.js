import { getProducts } from '$lib/api/client';

export async function load() {
	const { items } = await getProducts();
	return { products: items };
}
