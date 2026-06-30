import { formatPrice } from '$lib/data/marketplace';
import { allProducts, categories, collections } from '$lib/admin/catalog-mock';
import { loadConsultations } from '$lib/admin/consultations';

export const orderStatuses = {
	pending: { label: 'Gözləyir', tone: 'warning' },
	confirmed: { label: 'Təsdiqlənib', tone: 'info' },
	delivering: { label: 'Çatdırılır', tone: 'info' },
	completed: { label: 'Tamamlanıb', tone: 'success' },
	cancelled: { label: 'Ləğv', tone: 'danger' }
};

/** @type {Array<{ id: string, customer: string, email: string, total: number, items: number, status: keyof typeof orderStatuses, date: string }>} */
export const mockOrders = [
	{ id: 'OP-1042', customer: 'Leyla Həsənova', email: 'leyla@mail.az', total: 1782, items: 1, status: 'delivering', date: '2026-06-28' },
	{ id: 'OP-1041', customer: 'Rəşad Quliyev', email: 'rashad@mail.az', total: 1164, items: 2, status: 'confirmed', date: '2026-06-27' },
	{ id: 'OP-1040', customer: 'Nərgiz Əliyeva', email: 'nargiz@mail.az', total: 2459, items: 3, status: 'pending', date: '2026-06-27' },
	{ id: 'OP-1039', customer: 'Tural İsmayılov', email: 'tural@mail.az', total: 817, items: 1, status: 'completed', date: '2026-06-26' },
	{ id: 'OP-1038', customer: 'Aysel Məlikova', email: 'aysel@mail.az', total: 520, items: 1, status: 'completed', date: '2026-06-25' },
	{ id: 'OP-1037', customer: 'Orxan Cabbarov', email: 'orxan@mail.az', total: 149, items: 1, status: 'cancelled', date: '2026-06-24' }
];

/** @type {Array<{ id: string, name: string, email: string, orders: number, spent: number, joined: string }>} */
export const mockCustomers = [
	{ id: 'u-1', name: 'Leyla Həsənova', email: 'leyla@mail.az', orders: 3, spent: 3240, joined: '2025-11-12' },
	{ id: 'u-2', name: 'Rəşad Quliyev', email: 'rashad@mail.az', orders: 2, spent: 1890, joined: '2026-01-08' },
	{ id: 'u-3', name: 'Nərgiz Əliyeva', email: 'nargiz@mail.az', orders: 5, spent: 5120, joined: '2025-08-22' },
	{ id: 'u-4', name: 'Tural İsmayılov', email: 'tural@mail.az', orders: 1, spent: 817, joined: '2026-06-10' },
	{ id: 'u-5', name: 'Aysel Məlikova', email: 'aysel@mail.az', orders: 4, spent: 2680, joined: '2025-12-03' }
];

export function getDashboardStats() {
	const consultations = loadConsultations();
	const revenue = mockOrders
		.filter((o) => o.status === 'completed' || o.status === 'delivering')
		.reduce((s, o) => s + o.total, 0);

	return {
		revenue,
		orders: mockOrders.length,
		products: allProducts.length,
		consultations: consultations.filter((c) => c.status === 'new').length,
		lowStock: allProducts.filter((p) => !p.inStock).length,
		categories: categories.length,
		collections: collections.length
	};
}

export function getRecentOrders(limit = 5) {
	return mockOrders.slice(0, limit);
}

export function getTopProducts(limit = 5) {
	return allProducts.slice(0, limit).map((p, i) => ({
		...p,
		sales: 48 - i * 7,
		revenue: p.price * (48 - i * 7)
	}));
}

export { allProducts, categories, collections, formatPrice, loadConsultations };
