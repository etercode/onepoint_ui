import { getCustomers } from '$lib/api/client';

export const ssr = false;

export async function load() {
	try {
		const res = await getCustomers();
		return { customers: res.items ?? res ?? [] };
	} catch (e) {
		console.error('Admin customers: failed to load', e);
		return { customers: [], apiUnavailable: true };
	}
}
