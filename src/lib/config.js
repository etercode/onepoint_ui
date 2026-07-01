export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8088';

/**
 * Resolves an image reference to an absolute URL.
 * - Absolute URLs (seeded catalog images) are returned as-is.
 * - Already-rooted paths (e.g. "/uploads/avatars/x.webp") get the API origin.
 * - Bare relative paths (e.g. "categories/x.webp", "products/x.webp") are stored
 *   relative to the public uploads root, so they resolve under "/uploads/".
 *
 * @param {string | null | undefined} path
 */
export function resolveApiUrl(path) {
	if (!path) return null;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	if (path.startsWith('/')) return `${API_URL}${path}`;
	return `${API_URL}/uploads/${path}`;
}
