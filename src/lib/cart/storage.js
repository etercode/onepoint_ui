import { browser } from '$app/environment';

const CART_KEY = 'onepoint_cart';

/** @typedef {{ productId: string, quantity: number }} CartLine */

/** @returns {CartLine[]} */
export function loadCart() {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(CART_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/** @param {CartLine[]} items */
export function saveCart(items) {
	if (!browser) return;
	localStorage.setItem(CART_KEY, JSON.stringify(items));
}
