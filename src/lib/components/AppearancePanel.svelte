<script>
	import { appearance } from '$lib/appearance/store.svelte';
	import { accents, fontFamilies, fontSizes } from '$lib/appearance/themes';

	let saved = $state(false);

	/** @type {Array<{ id: import('$lib/appearance/themes.js').ThemeId, label: string }>} */
	const themeOptions = [
		{ id: 'light', label: 'Açıq' },
		{ id: 'dark', label: 'Tünd' },
		{ id: 'dim', label: 'Yumuşaq tünd' }
	];

	async function save() {
		saved = false;
		await appearance.persist();
		saved = true;
		setTimeout(() => (saved = false), 2500);
	}
</script>

<section class="mp-settings-panel">
	<h2>Tema</h2>
	<p class="mp-settings-desc">Tətbiqin əsas görünüşünü seçin.</p>

	<div class="mp-option-grid">
		{#each themeOptions as option}
			<button
				type="button"
				class="mp-option-card"
				class:mp-option-card-active={appearance.prefs.theme === option.id}
				onclick={() => appearance.set({ theme: option.id })}
			>
				<span class="mp-theme-swatch mp-theme-swatch-{option.id}"></span>
				<span>{option.label}</span>
			</button>
		{/each}
	</div>
</section>

<section class="mp-settings-panel">
	<h2>Vurğu rəngi</h2>
	<p class="mp-settings-desc">Düymələr və seçilmiş elementlər üçün.</p>

	<div class="mp-accent-grid">
		{#each Object.entries(accents) as [id, accent]}
			<button
				type="button"
				class="mp-accent-swatch"
				class:mp-accent-swatch-active={appearance.prefs.accent === id}
				style="--swatch-color: {accent.primary}"
				title={accent.label}
				aria-label={accent.label}
				onclick={() => appearance.set({ accent: /** @type {import('$lib/appearance/themes.js').AccentId} */ (id) })}
			></button>
		{/each}
	</div>
</section>

<section class="mp-settings-panel">
	<h2>Şrift</h2>
	<p class="mp-settings-desc">Mətn üslubu.</p>

	<div class="mp-chip-row">
		{#each Object.entries(fontFamilies) as [id, font]}
			<button
				type="button"
				class="mp-chip-btn"
				class:mp-chip-btn-active={appearance.prefs.fontFamily === id}
				onclick={() => appearance.set({ fontFamily: /** @type {import('$lib/appearance/themes.js').FontFamilyId} */ (id) })}
			>
				{font.label}
			</button>
		{/each}
	</div>
</section>

<section class="mp-settings-panel">
	<h2>Mətn ölçüsü</h2>
	<p class="mp-settings-desc">Oxuma rahatlığı üçün.</p>

	<div class="mp-chip-row">
		{#each Object.entries(fontSizes) as [id, size]}
			<button
				type="button"
				class="mp-chip-btn"
				class:mp-chip-btn-active={appearance.prefs.fontSize === id}
				onclick={() => appearance.set({ fontSize: /** @type {import('$lib/appearance/themes.js').FontSizeId} */ (id) })}
			>
				{size.label}
			</button>
		{/each}
	</div>
</section>

<div class="mp-settings-save">
	{#if saved}
		<span class="mp-alert mp-alert-success" role="status" style="display: inline-block; margin-right: 0.75rem;">Saxlanıldı</span>
	{/if}
	<button type="button" class="mp-btn-primary" disabled={appearance.saving} onclick={save}>
		{appearance.saving ? 'Saxlanılır…' : 'Görünüşü saxla'}
	</button>
	<p class="mp-settings-desc" style="margin-top: 0.75rem;">Bu brauzerdə saxlanılır. Hesab sinxronizasiyası tezliklə.</p>
</div>
