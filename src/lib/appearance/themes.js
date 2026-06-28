/** @typedef {'light' | 'dark' | 'dim'} ThemeId */

/** @type {Record<ThemeId, Record<string, string>>} */
export const themes = {
	light: {
		'--color-bg': '#f0f2f5',
		'--color-surface': '#ffffff',
		'--color-surface-elevated': '#ffffff',
		'--color-text': '#050505',
		'--color-muted': '#65676b',
		'--color-border': '#e4e6eb',
		'--color-hover': '#f2f3f5',
		'--color-danger-bg': '#fef2f2',
		'--color-success-bg': '#ecfdf5',
		'--shadow': '0 1px 2px rgb(0 0 0 / 0.08)',
		'--shadow-md': '0 8px 24px rgb(0 0 0 / 0.12)',
		'--overlay': 'rgb(0 0 0 / 0.65)'
	},
	dark: {
		'--color-bg': '#000000',
		'--color-surface': '#16181c',
		'--color-surface-elevated': '#1e2126',
		'--color-text': '#e7e9ea',
		'--color-muted': '#8b98a5',
		'--color-border': '#2f3336',
		'--color-hover': '#1a1d21',
		'--color-danger-bg': '#2a1515',
		'--color-success-bg': '#0f2419',
		'--shadow': '0 1px 2px rgb(0 0 0 / 0.4)',
		'--shadow-md': '0 8px 24px rgb(0 0 0 / 0.5)',
		'--overlay': 'rgb(0 0 0 / 0.75)'
	},
	dim: {
		'--color-bg': '#15202b',
		'--color-surface': '#192734',
		'--color-surface-elevated': '#22303c',
		'--color-text': '#f7f9f9',
		'--color-muted': '#8b98a5',
		'--color-border': '#38444d',
		'--color-hover': '#1c2732',
		'--color-danger-bg': '#2a1515',
		'--color-success-bg': '#0f2419',
		'--shadow': '0 1px 2px rgb(0 0 0 / 0.35)',
		'--shadow-md': '0 8px 24px rgb(0 0 0 / 0.45)',
		'--overlay': 'rgb(0 0 0 / 0.7)'
	}
};

/** @typedef {'blue' | 'facebook' | 'purple' | 'green' | 'rose'} AccentId */

/** @type {Record<AccentId, { label: string, primary: string, hover: string, accent: string }>} */
export const accents = {
	blue: { label: 'Sky', primary: '#1d9bf0', hover: '#1a8cd8', accent: 'rgb(29 155 240 / 0.12)' },
	facebook: { label: 'Classic', primary: '#1877f2', hover: '#166fe5', accent: 'rgb(24 119 242 / 0.12)' },
	purple: { label: 'Violet', primary: '#7c3aed', hover: '#6d28d9', accent: 'rgb(124 58 237 / 0.12)' },
	green: { label: 'Mint', primary: '#00ba7c', hover: '#00a06b', accent: 'rgb(0 186 124 / 0.12)' },
	rose: { label: 'Rose', primary: '#f91880', hover: '#e0166f', accent: 'rgb(249 24 128 / 0.12)' }
};

/** @typedef {'system' | 'classic' | 'mono'} FontFamilyId */

/** @type {Record<FontFamilyId, { label: string, stack: string, headline: string }>} */
export const fontFamilies = {
	system: {
		label: 'System',
		stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
		headline: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
	},
	classic: {
		label: 'Classic',
		stack: "Georgia, 'Times New Roman', serif",
		headline: "Georgia, 'Times New Roman', serif"
	},
	mono: {
		label: 'Mono',
		stack: "ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace",
		headline: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
	}
};

/** @typedef {'sm' | 'md' | 'lg'} FontSizeId */

/** @type {Record<FontSizeId, { label: string, base: string }>} */
export const fontSizes = {
	sm: { label: 'Small', base: '15px' },
	md: { label: 'Medium', base: '16px' },
	lg: { label: 'Large', base: '18px' }
};

/** @typedef {{ theme: ThemeId, accent: AccentId, fontFamily: FontFamilyId, fontSize: FontSizeId }} AppearancePrefs */

/** @returns {AppearancePrefs} */
export function defaultPreferences() {
	return {
		theme: 'light',
		accent: 'blue',
		fontFamily: 'system',
		fontSize: 'md'
	};
}
