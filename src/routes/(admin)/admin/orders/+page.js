import { getOrders } from '$lib/api/client';

export const ssr = false;

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ url }) {
	const status = url.searchParams.get('status') ?? '';

	try {
		const res = await getOrders({
			status: status || undefined,
			limit: 100
		});
		return {
			orders: res.items ?? res ?? [],
			statusFilter: status
		};
	} catch (e) {
		console.error('Admin orders: failed to load', e);
		return { orders: [], statusFilter: status, apiUnavailable: true };
	}
}
