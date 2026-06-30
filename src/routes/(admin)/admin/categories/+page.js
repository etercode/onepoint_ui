import { getCategories } from '$lib/api/client';

export async function load() {
	try {
		const { items } = await getCategories();
		return { categories: items ?? [] };
	} catch (e) {
		console.error('Admin categories: failed to load', e);
		return { categories: [], apiUnavailable: true };
	}
}
