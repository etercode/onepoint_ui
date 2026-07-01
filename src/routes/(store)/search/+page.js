import { getProducts, searchSuggest } from '$lib/api/client';

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ url }) {
	const query = url.searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return { query: '', results: [], total: 0, suggestion: null };
	}

	try {
		// Use the same typo-tolerant search as the header dropdown, then hydrate
		// the matches into full product cards (preserving relevance order).
		const suggest = await searchSuggest(query, 24);
		const ids = (suggest?.results ?? []).map((r) => r.id);

		let results = [];
		if (ids.length) {
			const { items } = await getProducts({ ids: ids.join(','), limit: ids.length });
			const order = new Map(ids.map((id, i) => [id, i]));
			results = [...(items ?? [])].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
		}

		return { query, results, total: results.length, suggestion: suggest?.suggestion ?? null };
	} catch (e) {
		console.error('Search: failed to load', query, e);
		return { query, results: [], total: 0, suggestion: null, apiUnavailable: true };
	}
}
