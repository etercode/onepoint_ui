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
	if (!headers.has('Content-Type') && options.body) {
		headers.set('Content-Type', 'application/json');
	}

	if (auth) {
		const token = getAccessToken();
		if (token) headers.set('Authorization', `Bearer ${token}`);
	}

	let response = await fetch(`${API_URL}${path}`, { ...options, headers });

	if (auth && response.status === 401) {
		const refreshed = await tryRefresh();
		if (refreshed) {
			const token = getAccessToken();
			if (token) headers.set('Authorization', `Bearer ${token}`);
			response = await fetch(`${API_URL}${path}`, { ...options, headers });
		}
	}

	if (!response.ok) {
		const body = await parseJson(response);
		throw new ApiClientError(response.status, body ?? {}, formatError(body, response.status));
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

export function isLoggedIn() {
	return getAccessToken() !== null;
}
