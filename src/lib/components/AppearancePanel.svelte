<script>
	import { appearance } from '$lib/appearance/store.svelte';
	import { accents, fontFamilies, fontSizes } from '$lib/appearance/themes';

	let saved = $state(false);

	/** @type {Array<{ id: import('$lib/appearance/themes.js').ThemeId, label: string }>} */
	const themeOptions = [
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' },
		{ id: 'dim', label: 'Dim' }
	];

	async function save() {
		saved = false;
		await appearance.persist();
		saved = true;
		setTimeout(() => (saved = false), 2500);
	}
</script>

<section class="panel">
	<h2>Theme</h2>
	<p class="panel-desc">Choose a base look for the app.</p>

	<div class="option-grid">
		{#each themeOptions as option}
			<button
				type="button"
				class="option-card"
				class:option-card-active={appearance.prefs.theme === option.id}
				onclick={() => appearance.set({ theme: option.id })}
			>
				<span class="theme-swatch theme-swatch-{option.id}"></span>
				<span>{option.label}</span>
			</button>
		{/each}
	</div>
</section>

<section class="panel">
	<h2>Accent color</h2>
	<p class="panel-desc">Links, buttons, and highlights.</p>

	<div class="accent-grid">
		{#each Object.entries(accents) as [id, accent]}
			<button
				type="button"
				class="accent-swatch"
				class:accent-swatch-active={appearance.prefs.accent === id}
				style="--swatch-color: {accent.primary}"
				title={accent.label}
				aria-label={accent.label}
				onclick={() => appearance.set({ accent: /** @type {import('$lib/appearance/themes.js').AccentId} */ (id) })}
			></button>
		{/each}
	</div>
</section>

<section class="panel">
	<h2>Font</h2>
	<p class="panel-desc">Body text style across the app.</p>

	<div class="option-row">
		{#each Object.entries(fontFamilies) as [id, font]}
			<button
				type="button"
				class="chip-btn"
				class:chip-btn-active={appearance.prefs.fontFamily === id}
				onclick={() => appearance.set({ fontFamily: /** @type {import('$lib/appearance/themes.js').FontFamilyId} */ (id) })}
			>
				{font.label}
			</button>
		{/each}
	</div>
</section>

<section class="panel">
	<h2>Text size</h2>
	<p class="panel-desc">Comfort reading scale.</p>

	<div class="option-row">
		{#each Object.entries(fontSizes) as [id, size]}
			<button
				type="button"
				class="chip-btn"
				class:chip-btn-active={appearance.prefs.fontSize === id}
				onclick={() => appearance.set({ fontSize: /** @type {import('$lib/appearance/themes.js').FontSizeId} */ (id) })}
			>
				{size.label}
			</button>
		{/each}
	</div>
</section>

<div class="appearance-save">
	{#if saved}
		<span class="save-note" role="status">Appearance saved</span>
	{/if}
	<button type="button" class="btn" disabled={appearance.saving} onclick={save}>
		{appearance.saving ? 'Saving…' : 'Save appearance'}
	</button>
	<p class="panel-desc">Saved in this browser now. Syncs to your account when the preferences API is live.</p>
</div>
