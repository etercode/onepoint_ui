import { browser } from '$app/environment';

const STORAGE_KEY = 'adm-theme';

/** @type {'dark' | 'light'} */
let theme = $state('dark');

/**
 * Admin panel theme (dark by default, with a light option). Persisted to
 * localStorage. The value is applied as `data-theme` on the `.adm-app` element
 * so the CSS custom properties in admin.css switch palette.
 */
export const adminTheme = {
	get value() {
		return theme;
	},

	/** @param {'dark' | 'light'} next */
	set(next) {
		theme = next;
		if (browser) localStorage.setItem(STORAGE_KEY, next);
	},

	toggle() {
		this.set(theme === 'dark' ? 'light' : 'dark');
	},

	init() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') theme = stored;
	}
};
