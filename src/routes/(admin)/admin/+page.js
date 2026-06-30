import { getDashboard } from '$lib/api/client';

export const ssr = false;

export async function load() {
	try {
		const dashboard = await getDashboard();
		return { dashboard };
	} catch (e) {
		console.error('Admin dashboard: failed to load', e);
		return { dashboard: null, apiUnavailable: true };
	}
}
