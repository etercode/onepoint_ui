import { browser } from '$app/environment';
import { loadCart, saveCart } from '$lib/cart/storage';

/** @typedef {{ productId: number, quantity: number }} CartLine */

class CartState {
	/** @type {CartLine[]} */
	items = $state([]);

	ready = $state(false);

	get count() {
		return this.items.reduce((sum, line) => sum + line.quantity, 0);
	}

	init() {
		if (!browser || this.ready) return;
		this.items = loadCart();
		this.ready = true;
	}

	/** @param {Record<string, unknown>} product @param {number} [quantity] */
	add(product, quantity = 1) {
		if (!product?.inStock) return false;

		const productId = /** @type {number} */ (product.id);
		const existing = this.items.find((line) => line.productId === productId);
		if (existing) {
			this.items = this.items.map((line) =>
				line.productId === productId
					? { ...line, quantity: line.quantity + quantity }
					: line
			);
		} else {
			this.items = [...this.items, { productId, quantity }];
		}
		saveCart(this.items);
		return true;
	}

	/** @param {number} productId */
	remove(productId) {
		this.items = this.items.filter((line) => line.productId !== productId);
		saveCart(this.items);
	}

	/** @param {number} productId @param {number} quantity */
	setQuantity(productId, quantity) {
		if (quantity < 1) {
			this.remove(productId);
			return;
		}
		this.items = this.items.map((line) =>
			line.productId === productId ? { ...line, quantity } : line
		);
		saveCart(this.items);
	}

	clear() {
		this.items = [];
		saveCart(this.items);
	}

	/** @param {number} productId */
	has(productId) {
		return this.items.some((line) => line.productId === productId);
	}

	/** @param {number} productId */
	quantityOf(productId) {
		return this.items.find((line) => line.productId === productId)?.quantity ?? 0;
	}
}

export const cart = new CartState();
