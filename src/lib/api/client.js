import { API_URL } from '$lib/config';
import { clearSession, getAccessToken, getRefreshToken, saveSession } from '$lib/auth/session';

export class ApiClientError extends Error {
	/** @param {number} status @param {unknown} body @param {string} [message] */
	constructor(status, body, message) {
		super(message ?? `Request failed with status ${status}`);
		this.status = status;
		this.body = body;
	}
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

	let response = await fetch(`${API_URL}${path}`, { ...options, headers, body });

	if (auth && response.status === 401) {
		const refreshed = await tryRefresh();
		if (refreshed) {
			const token = getAccessToken();
			if (token) headers.set('Authorization', `Bearer ${token}`);
			response = await fetch(`${API_URL}${path}`, { ...options, headers, body });
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
