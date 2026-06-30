import { browser } from '$app/environment';
import { goto } from '$app/navigation';

/** Whether the user has navigated within this app session (safe to use history.back). */
let hasInAppHistory = false;

/** Called from root layout via afterNavigate — must not run at module scope. */
export function markInAppHistory() {
	hasInAppHistory = true;
}

/** @param {string} pathname */
export function getBackFallback(pathname) {
	if (pathname.startsWith('/product/')) return '/catalog';
	if (pathname.startsWith('/category/')) return '/catalog';
	if (pathname.startsWith('/collection/')) return '/catalog';
	if (pathname === '/cart') return '/catalog';
	if (pathname.startsWith('/search')) return '/catalog';
	if (pathname.startsWith('/settings')) return '/';
	if (pathname.startsWith('/admin')) return '/admin';
	return '/';
}

/** @param {string} [fallback] */
export function goBack(fallback = '/') {
	if (!browser) return;

	if (hasInAppHistory) {
		history.back();
		return;
	}

	goto(fallback);
}

/** @param {string} pathname */
export function goBackFrom(pathname) {
	goBack(getBackFallback(pathname));
}
