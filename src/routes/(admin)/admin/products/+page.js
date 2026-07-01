import { getCategories, getProducts } from '$lib/api/client';

export async function load() {
	try {
		const [productsRes, categoriesRes] = await Promise.all([
			getProducts({ limit: 100, sort: 'newest' }),
			getCategories().catch(() => ({ items: [] }))
		]);
		return { products: productsRes?.items ?? [], categories: categoriesRes?.items ?? [] };
	} catch (e) {
		console.error('Admin products: failed to load', e);
		return { products: [], categories: [], apiUnavailable: true };
	}
}
