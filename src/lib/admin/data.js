export const orderStatuses = {
	pending: { label: 'Gözləyir', tone: 'warning' },
	confirmed: { label: 'Təsdiqlənib', tone: 'info' },
	delivering: { label: 'Çatdırılır', tone: 'info' },
	completed: { label: 'Tamamlanıb', tone: 'success' },
	cancelled: { label: 'Ləğv', tone: 'danger' }
};

/** @param {string} status */
export function orderStatusPillClass(status) {
	const tone = orderStatuses[/** @type {keyof typeof orderStatuses} */ (status)]?.tone ?? 'info';
	if (tone === 'success') return 'success';
	if (tone === 'warning') return 'warning';
	if (tone === 'danger') return 'danger';
	return 'info';
}

export { formatPrice } from '$lib/data/marketplace';
