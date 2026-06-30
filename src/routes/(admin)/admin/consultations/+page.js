import { getConsultations } from '$lib/api/client';

export const ssr = false;

/** @param {import('./$types').PageLoadEvent} event */
export async function load({ url }) {
	const status = url.searchParams.get('status') ?? '';

	try {
		const res = await getConsultations({ status: status || undefined });
		return {
			consultations: res.items ?? res ?? [],
			statusFilter: status
		};
	} catch (e) {
		console.error('Admin consultations: failed to load', e);
		return { consultations: [], statusFilter: status, apiUnavailable: true };
	}
}
