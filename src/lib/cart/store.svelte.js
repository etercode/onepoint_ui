import { browser } from '$app/environment';
import { getProductById } from '$lib/data/marketplace';
import { loadCart, saveCart } from '$lib/cart/storage';

/** @typedef {{ productId: string, quantity: number }} CartLine */

class CartState {
	/** @type {CartLine[]} */
	items = $state([]);

	ready = $state(false);

	get count() {
		return this.items.reduce((sum, line) => sum + line.quantity, 0);
	}

	get lines() {
		return this.items
			.map((line) => {
				const product = getProductById(line.productId);
				if (!product) return null;
				return { ...line, product, lineTotal: product.price * line.quantity };
			})
			.filter(Boolean);
	}

	get subtotal() {
		return this.lines.reduce((sum, line) => sum + line.lineTotal, 0);
	}

	init() {
		if (!browser || this.ready) return;
		this.items = loadCart();
		this.ready = true;
	}

	/** @param {string} productId @param {number} [quantity] */
	add(productId, quantity = 1) {
		const product = getProductById(productId);
		if (!product || !product.inStock) return false;

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

	/** @param {string} productId */
	remove(productId) {
		this.items = this.items.filter((line) => line.productId !== productId);
		saveCart(this.items);
	}

	/** @param {string} productId @param {number} quantity */
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

	/** @param {string} productId */
	has(productId) {
		return this.items.some((line) => line.productId === productId);
	}

	/** @param {string} productId */
	quantityOf(productId) {
		return this.items.find((line) => line.productId === productId)?.quantity ?? 0;
	}
}

export const cart = new CartState();
