import { browser } from '$app/environment';
import { clearSession, getAccessToken, getRefreshToken, saveSession } from '$lib/auth/session';

export class ApiClientError extends Error {
	/** @param {number} status @param {unknown} body @param {string} [message] */
	constructor(status, body, message) {
		super(message ?? `Request failed with status ${status}`);
		this.status = status;
		this.body = body;
	}
}

const REQUEST_TIMEOUT_MS = 15_000;
const DEFAULT_API_URL = 'http://localhost:8088';

async function apiBase() {
	if (browser) {
		return import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
	}
	return process.env.API_URL ?? import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
}

/** @param {Response} response */
async function parseJson(response) {
	const text = await response.text();
	if (!text) return null;
	return JSON.parse(text);
}

/** @param {string} path @param {RequestInit} [options] @param {boolean} [auth] */
async function request(path, options = {}, auth = false) {
	const headers = new Headers(options.headers);
	const body = options.body;
	if (!headers.has('Content-Type') && body && !(body instanceof FormData)) {
		headers.set('Content-Type', 'application/json');
	}

	if (auth) {
		const token = getAccessToken();
		if (token) headers.set('Authorization', `Bearer ${token}`);
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	const fetchOptions = { ...options, headers, body, signal: controller.signal };

	let response;
	try {
		response = await fetch(`${await apiBase()}${path}`, fetchOptions);
	} catch (e) {
		clearTimeout(timeoutId);
		if (e instanceof Error && e.name === 'AbortError') {
			throw new ApiClientError(504, {}, 'API request timed out');
		}
		throw new ApiClientError(503, {}, 'API is unreachable');
	}
	clearTimeout(timeoutId);

	if (auth && response.status === 401) {
		const refreshed = await tryRefresh();
		if (refreshed) {
			const token = getAccessToken();
			if (token) headers.set('Authorization', `Bearer ${token}`);
			const retryController = new AbortController();
			const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT_MS);
			try {
				response = await fetch(`${await apiBase()}${path}`, {
					...options,
					headers,
					body,
					signal: retryController.signal
				});
			} catch (e) {
				clearTimeout(retryTimeoutId);
				if (e instanceof Error && e.name === 'AbortError') {
					throw new ApiClientError(504, {}, 'API request timed out');
				}
				throw new ApiClientError(503, {}, 'API is unreachable');
			}
			clearTimeout(retryTimeoutId);
		}
	}

	if (!response.ok) {
		const parsed = await parseJson(response);
		throw new ApiClientError(response.status, parsed ?? {}, formatError(parsed, response.status));
	}

	if (response.status === 204) return undefined;
	return parseJson(response);
}

/** @param {Record<string, unknown> | null} body @param {number} status */
function formatError(body, status) {
	if (!body) return `Request failed (${status})`;

	if ('violations' in body && Array.isArray(body.violations) && body.violations.length) {
		return body.violations.map((v) => `${v.propertyPath}: ${v.title}`).join(', ');
	}

	if ('message' in body && body.message) return String(body.message);
	if ('error' in body && body.error) return String(body.error).replace(/_/g, ' ');
	if ('detail' in body && body.detail) return String(body.detail);

	return `Request failed (${status})`;
}

async function tryRefresh() {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return false;

	try {
		const tokens = await request('/api/token/refresh', {
			method: 'POST',
			body: JSON.stringify({ refresh_token: refreshToken })
		});
		saveSession(tokens);
		return true;
	} catch {
		clearSession();
		return false;
	}
}

/** @param {Record<string, unknown>} data */
export async function register(data) {
	return request('/api/register', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

/** @param {{ email: string, password: string }} credentials */
export async function login(credentials) {
	const tokens = await request('/api/login', {
		method: 'POST',
		body: JSON.stringify(credentials)
	});
	saveSession(tokens);
	return tokens;
}

export async function logout() {
	try {
		await request('/api/logout', { method: 'POST' }, true);
	} finally {
		clearSession();
	}
}

export async function getMe() {
	return request('/api/me', {}, true);
}

/** @param {Record<string, unknown>} data */
export async function updateProfile(data) {
	return request('/api/me', {
		method: 'PATCH',
		body: JSON.stringify(data)
	}, true);
}

/** @param {{ currentPassword: string, newPassword: string }} data */
export async function changePassword(data) {
	return request('/api/me/password', {
		method: 'POST',
		body: JSON.stringify(data)
	}, true);
}

/** @param {File} photo */
export async function uploadProfilePhoto(photo) {
	const form = new FormData();
	form.append('photo', photo);
	return request('/api/me/photo', {
		method: 'POST',
		body: form
	}, true);
}

/** @param {string} username */
export async function checkUsernameAvailable(username) {
	const params = new URLSearchParams({ username });
	return request(`/api/username/available?${params}`);
}

export function isLoggedIn() {
	return getAccessToken() !== null;
}

/** User UI preferences (appearance). API pending — see OpenAPI prompt. */
export async function getPreferences() {
	return request('/api/me/preferences', {}, true);
}

/** @param {{ appearance?: Record<string, unknown> }} data */
export async function updatePreferences(data) {
	return request('/api/me/preferences', {
		method: 'PATCH',
		body: JSON.stringify(data)
	}, true);
}

/** @param {Record<string, string | number | boolean | undefined>} params */
function catalogQuery(params) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '') continue;
		search.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : '';
}

/** @param {Record<string, string | number | boolean | undefined>} [params] */
export async function getProducts(params = {}) {
	return request(`/api/products${catalogQuery(params)}`);
}

/** @param {number | string} id */
export async function getProduct(id) {
	return request(`/api/products/${id}`);
}

/** @param {number | string} id */
export async function getRelatedProducts(id) {
	return request(`/api/products/${id}/related`);
}

export async function getCategories() {
	return request('/api/categories');
}

/** @param {string} slug */
export async function getCategory(slug) {
	return request(`/api/categories/${slug}`);
}

/** @param {{ featured?: boolean }} [options] */
export async function getCollections({ featured } = {}) {
	return request(`/api/collections${featured ? '?featured=1' : ''}`);
}

/** @param {string} slug */
export async function getCollection(slug) {
	return request(`/api/collections/${slug}`);
}

/** Catalog mega-menu content (editable text + random promo products). */
export async function getCatalogMenu() {
	return request('/api/catalog-menu');
}

/** @param {string} q @param {number} [limit] Typo-tolerant search suggestions. */
export async function searchSuggest(q, limit = 6) {
	const params = new URLSearchParams({ q, limit: String(limit) });
	return request(`/api/search/suggest?${params}`);
}

// ——— Admin catalog (requires ROLE_ADMIN) ———

/** @param {Record<string, unknown>} data */
export async function createProduct(data) {
	return request('/api/admin/products', {
		method: 'POST',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id @param {Record<string, unknown>} data */
export async function updateProduct(id, data) {
	return request(`/api/admin/products/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id */
export async function deleteProduct(id) {
	return request(`/api/admin/products/${id}`, { method: 'DELETE' }, true);
}

/** Partial update for inline list toggles (stock / new). @param {number | string} id @param {Record<string, unknown>} data */
export async function patchProduct(id, data) {
	return request(`/api/admin/products/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id @param {File} file */
export async function uploadProductImage(id, file) {
	const form = new FormData();
	form.append('image', file);
	return request(`/api/admin/products/${id}/images/upload`, {
		method: 'POST',
		body: form
	}, true);
}

/** @param {number | string} productId @param {string} url */
export async function addProductImageUrl(productId, url) {
	return request(`/api/admin/products/${productId}/images`, {
		method: 'POST',
		body: JSON.stringify({ url })
	}, true);
}

/** @param {number | string} productId @param {number[]} ids */
export async function reorderProductImages(productId, ids) {
	return request(`/api/admin/products/${productId}/images/order`, {
		method: 'PUT',
		body: JSON.stringify({ ids })
	}, true);
}

/** @param {number | string} productId @param {number | string} imageId */
export async function deleteProductImage(productId, imageId) {
	return request(`/api/admin/products/${productId}/images/${imageId}`, {
		method: 'DELETE'
	}, true);
}

/** @param {Record<string, unknown>} data */
export async function createCategory(data) {
	return request('/api/admin/categories', {
		method: 'POST',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id @param {Record<string, unknown>} data */
export async function updateCategory(id, data) {
	return request(`/api/admin/categories/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id */
export async function deleteCategory(id) {
	return request(`/api/admin/categories/${id}`, { method: 'DELETE' }, true);
}

/** @param {number | string} id @param {File} file */
export async function uploadCategoryImage(id, file) {
	const form = new FormData();
	form.append('image', file);
	return request(`/api/admin/categories/${id}/image`, {
		method: 'POST',
		body: form
	}, true);
}

// ——— Category spec attributes (requires ROLE_ADMIN) ———

/** @param {number | string} categoryId */
export async function getCategoryAttributes(categoryId) {
	return request(`/api/admin/categories/${categoryId}/attributes`, {}, true);
}

/** @param {number | string} categoryId @param {Record<string, unknown>} data */
export async function createCategoryAttribute(categoryId, data) {
	return request(`/api/admin/categories/${categoryId}/attributes`, {
		method: 'POST',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} categoryId @param {number | string} attrId @param {Record<string, unknown>} data */
export async function updateCategoryAttribute(categoryId, attrId, data) {
	return request(`/api/admin/categories/${categoryId}/attributes/${attrId}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} categoryId @param {number | string} attrId */
export async function deleteCategoryAttribute(categoryId, attrId) {
	return request(`/api/admin/categories/${categoryId}/attributes/${attrId}`, {
		method: 'DELETE'
	}, true);
}

/** @param {Record<string, unknown>} data */
export async function createCollection(data) {
	return request('/api/admin/collections', {
		method: 'POST',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id @param {Record<string, unknown>} data */
export async function updateCollection(id, data) {
	return request(`/api/admin/collections/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	}, true);
}

/** @param {number | string} id */
export async function deleteCollection(id) {
	return request(`/api/admin/collections/${id}`, { method: 'DELETE' }, true);
}

/** @param {number | string} id @param {File} file */
export async function uploadCollectionImage(id, file) {
	const form = new FormData();
	form.append('image', file);
	return request(`/api/admin/collections/${id}/image`, {
		method: 'POST',
		body: form
	}, true);
}

// ——— Public consultations ———

/** @param {{ name: string, phone: string, room: string, message?: string }} data */
export async function submitConsultation(data) {
	return request('/api/consultations', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// ——— Admin orders, customers, consultations, dashboard ———

/** @param {Record<string, string | number | undefined>} [params] */
function adminQuery(params = {}) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '') continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : '';
}

/** @param {Record<string, string | number | undefined>} [params] */
export async function getOrders(params = {}) {
	return request(`/api/admin/orders${adminQuery(params)}`, {}, true);
}

/** @param {number | string} id */
export async function getOrder(id) {
	return request(`/api/admin/orders/${id}`, {}, true);
}

/** @param {number | string} id @param {string} status */
export async function updateOrderStatus(id, status) {
	return request(`/api/admin/orders/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ status })
	}, true);
}

export async function getCustomers() {
	return request('/api/admin/customers', {}, true);
}

/** @param {Record<string, string | undefined>} [params] */
export async function getConsultations(params = {}) {
	return request(`/api/admin/consultations${adminQuery(params)}`, {}, true);
}

/** @param {number | string} id @param {string} status */
export async function updateConsultationStatus(id, status) {
	return request(`/api/admin/consultations/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ status })
	}, true);
}

export async function getDashboard() {
	return request('/api/admin/dashboard', {}, true);
}

// ——— Admin catalog mega-menu content ———

export async function getAdminCatalogMenu() {
	return request('/api/admin/catalog-menu', {}, true);
}

/** @param {Record<string, unknown>} data */
export async function updateCatalogMenu(data) {
	return request('/api/admin/catalog-menu', {
		method: 'PUT',
		body: JSON.stringify(data)
	}, true);
}
