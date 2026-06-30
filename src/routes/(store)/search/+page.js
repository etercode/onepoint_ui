import { getProducts } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ url }) {
	const query = url.searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return { query: '', results: [], total: 0 };
	}

	const { items, total } = await getProducts({ q: query });
	return { query, results: items, total };
}
