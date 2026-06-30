import { browser } from '$app/environment';

const CART_KEY = 'onepoint_cart';

/** @typedef {{ productId: number, quantity: number }} CartLine */

/** @returns {CartLine[]} */
export function loadCart() {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(CART_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed
			.map((line) => ({
				productId: Number(line.productId),
				quantity: Number(line.quantity) || 1
			}))
			.filter((line) => Number.isInteger(line.productId) && line.productId > 0 && line.quantity > 0);
	} catch {
		return [];
	}
}

/** @param {CartLine[]} items */
export function saveCart(items) {
	if (!browser) return;
	localStorage.setItem(CART_KEY, JSON.stringify(items));
}
