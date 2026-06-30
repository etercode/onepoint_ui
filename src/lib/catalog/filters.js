/** @typedef {{
 *   minPrice: number,
 *   maxPrice: number,
 *   category: string,
 *   collection: string,
 *   inStockOnly: boolean,
 *   onSaleOnly: boolean
 * }} CatalogFilters */

/** @param {Record<string, unknown>[]} products */
export function getPriceBounds(products) {
	if (products.length === 0) return { min: 0, max: 0 };
	const prices = products.map((p) => /** @type {number} */ (p.price));
	return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** @returns {CatalogFilters} */
export function defaultFilters(bounds) {
	return {
		minPrice: bounds.min,
		maxPrice: bounds.max,
		category: '',
		collection: '',
		inStockOnly: false,
		onSaleOnly: false
	};
}

/** @param {Record<string, unknown>[]} products @param {CatalogFilters} filters */
export function filterProducts(products, filters) {
	const min = Math.min(filters.minPrice, filters.maxPrice);
	const max = Math.max(filters.minPrice, filters.maxPrice);
	return products.filter((p) => {
		if (p.price < min || p.price > max) return false;
		if (filters.category && p.category !== filters.category) return false;
		if (filters.collection && p.collection !== filters.collection) return false;
		if (filters.inStockOnly && !p.inStock) return false;
		if (filters.onSaleOnly && !p.onSale) return false;
		return true;
	});
}

/** @param {CatalogFilters} filters */
export function filtersToSearchParams(filters) {
	const params = new URLSearchParams();
	if (filters.minPrice != null) params.set('min', String(filters.minPrice));
	if (filters.maxPrice != null) params.set('max', String(filters.maxPrice));
	if (filters.category) params.set('category', filters.category);
	if (filters.collection) params.set('collection', filters.collection);
	if (filters.inStockOnly) params.set('stock', '1');
	if (filters.onSaleOnly) params.set('sale', '1');
	return params;
}

/** @param {URLSearchParams} params @param {{ min: number, max: number }} bounds */
export function filtersFromSearchParams(params, bounds) {
	return {
		minPrice: params.has('min') ? Number(params.get('min')) : bounds.min,
		maxPrice: params.has('max') ? Number(params.get('max')) : bounds.max,
		category: params.get('category') ?? '',
		collection: params.get('collection') ?? '',
		inStockOnly: params.get('stock') === '1',
		onSaleOnly: params.get('sale') === '1'
	};
}

/** @param {Record<string, unknown>[]} products */
export function getUniqueCollections(products) {
	return [...new Set(products.map((p) => p.collection))].sort();
}
