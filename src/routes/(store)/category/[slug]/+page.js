import { error } from '@sveltejs/kit';
import { ApiClientError, getCategory, getProducts } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ params }) {
	try {
		const [category, productsRes] = await Promise.all([
			getCategory(params.slug),
			getProducts({ category: params.slug })
		]);

		return {
			category,
			products: productsRes.items
		};
	} catch (e) {
		if (e instanceof ApiClientError && e.status === 404) {
			return { category: null, products: [] };
		}
		throw error(500, 'Kateqoriya yüklənə bilmədi');
	}
}
