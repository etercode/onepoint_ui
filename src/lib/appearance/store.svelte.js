import { browser } from '$app/environment';
import { accents, defaultPreferences, fontFamilies, fontSizes, themes } from '$lib/appearance/themes';
import { getPreferences, updatePreferences } from '$lib/api/client';

const STORAGE_KEY = 'onepoint_appearance';

class AppearanceState {
	/** @type {import('$lib/appearance/themes.js').AppearancePrefs} */
	prefs = $state(defaultPreferences());
	initialized = $state(false);
	saving = $state(false);

	init() {
		if (!browser || this.initialized) return;
		this.initialized = true;
		this.loadLocal();
		this.apply();
		this.syncFromServer();
	}

	loadLocal() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) this.prefs = { ...defaultPreferences(), ...JSON.parse(raw) };
		} catch {
			this.prefs = defaultPreferences();
		}
	}

	saveLocal() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prefs));
	}

	apply() {
		if (!browser) return;
		const root = document.documentElement;
		const theme = themes[this.prefs.theme] ?? themes.light;
		const accent = accents[this.prefs.accent] ?? accents.blue;
		const font = fontFamilies[this.prefs.fontFamily] ?? fontFamilies.system;
		const size = fontSizes[this.prefs.fontSize] ?? fontSizes.md;

		root.setAttribute('data-theme', this.prefs.theme);
		root.setAttribute('data-accent', this.prefs.accent);
		root.setAttribute('data-font-family', this.prefs.fontFamily);
		root.setAttribute('data-font-size', this.prefs.fontSize);

		for (const [key, value] of Object.entries(theme)) {
			root.style.setProperty(key, value);
		}

		root.style.setProperty('--color-primary', accent.primary);
		root.style.setProperty('--color-primary-hover', accent.hover);
		root.style.setProperty('--color-accent', accent.accent);
		root.style.setProperty('--font', font.stack);
		root.style.setProperty('--font-headline', font.headline);
		root.style.setProperty('--font-size-base', size.base);
	}

	/** @param {Partial<import('$lib/appearance/themes.js').AppearancePrefs>} patch */
	set(patch) {
		this.prefs = { ...this.prefs, ...patch };
		this.saveLocal();
		this.apply();
	}

	async syncFromServer() {
		try {
			const remote = await getPreferences();
			if (remote?.appearance) {
				this.prefs = { ...defaultPreferences(), ...remote.appearance };
				this.saveLocal();
				this.apply();
			}
		} catch {
			// API not available yet — local prefs only
		}
	}

	async persist() {
		this.saving = true;
		this.saveLocal();
		this.apply();
		try {
			await updatePreferences({ appearance: this.prefs });
		} catch {
			// Saved locally until API ships
		} finally {
			this.saving = false;
		}
	}
}

export const appearance = new AppearanceState();
