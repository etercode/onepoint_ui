const ACCESS_KEY = 'onepoint_access_token';
const REFRESH_KEY = 'onepoint_refresh_token';
const EXPIRES_KEY = 'onepoint_expires_at';

/** @param {{ access_token: string, refresh_token: string, expires_at: string }} tokens */
export function saveSession(tokens) {
	localStorage.setItem(ACCESS_KEY, tokens.access_token);
	localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
	localStorage.setItem(EXPIRES_KEY, tokens.expires_at);
}

export function clearSession() {
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
	localStorage.removeItem(EXPIRES_KEY);
}

export function getAccessToken() {
	return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
	return localStorage.getItem(REFRESH_KEY);
}
