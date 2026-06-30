import { getCategories, getDashboard } from '$lib/api/client';

export const ssr = false;

export async function load() {
	try {
		const [dashboard, categoriesRes] = await Promise.all([
			getDashboard(),
			getCategories()
		]);
		return {
			dashboard,
			categories: categoriesRes.items ?? []
		};
	} catch (e) {
		console.error('Admin analytics: failed to load', e);
		return { dashboard: null, categories: [], apiUnavailable: true };
	}
}
