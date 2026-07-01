<script>
	import { onMount } from 'svelte';
	import { COMPANY } from '$lib/data/marketplace';
	import { auth } from '$lib/auth/auth.svelte';
	import { adminTheme } from '$lib/admin/theme.svelte';
	import { getAdminCatalogMenu, updateCatalogMenu } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';

	let menu = $state({ heading: '', subheading: '', buttonLabel: '', buttonHref: '' });
	let menuLoading = $state(true);
	let menuSaving = $state(false);
	let menuError = $state('');
	let menuSaved = $state(false);

	onMount(async () => {
		try {
			const data = await getAdminCatalogMenu();
			menu = {
				heading: data.heading ?? '',
				subheading: data.subheading ?? '',
				buttonLabel: data.buttonLabel ?? '',
				buttonHref: data.buttonHref ?? ''
			};
		} catch (err) {
			menuError = formatAdminError(err);
		} finally {
			menuLoading = false;
		}
	});

	async function saveMenu() {
		menuError = '';
		menuSaved = false;
		if (!menu.heading.trim() || !menu.buttonLabel.trim() || !menu.buttonHref.trim()) {
			menuError = 'Başlıq, düymə adı və linki tələb olunur.';
			return;
		}
		menuSaving = true;
		try {
			await updateCatalogMenu(menu);
			menuSaved = true;
		} catch (err) {
			menuError = formatAdminError(err);
		} finally {
			menuSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Parametrlər — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Parametrlər</h1>
		<p>Admin panel və mağaza konfiqurasiyası</p>
	</div>
</div>

<section class="adm-panel" style="margin-bottom: 1rem;">
	<div class="adm-panel-head"><h2>Kataloq menyusu</h2></div>
	<div class="adm-panel-body-pad">
		<p style="color: var(--adm-muted); font-size: 0.875rem; margin-top: 0;">
			Mağaza başlığındakı “Kataloq” menyusunun mətnləri. Menyudakı 3 məhsul şəkli kataloqdan avtomatik seçilir.
		</p>
		{#if menuError}
			<div class="adm-alert adm-alert-error" role="alert">{menuError}</div>
		{/if}
		{#if menuSaved}
			<div class="adm-alert adm-alert-warn" role="status" style="background: var(--adm-success-bg); color: var(--adm-success);">Yadda saxlanıldı.</div>
		{/if}
		{#if menuLoading}
			<p class="adm-empty">Yüklənir…</p>
		{:else}
			<div class="adm-form-grid">
				<div class="adm-form-field adm-form-span-2">
					<label for="menu-heading">Başlıq</label>
					<input id="menu-heading" type="text" bind:value={menu.heading} />
				</div>
				<div class="adm-form-field adm-form-span-2">
					<label for="menu-sub">Alt başlıq</label>
					<input id="menu-sub" type="text" bind:value={menu.subheading} />
				</div>
				<div class="adm-form-field">
					<label for="menu-btn">Düymə adı</label>
					<input id="menu-btn" type="text" bind:value={menu.buttonLabel} />
				</div>
				<div class="adm-form-field">
					<label for="menu-href">Düymə linki</label>
					<input id="menu-href" type="text" bind:value={menu.buttonHref} />
				</div>
			</div>
			<div class="adm-form-actions">
				<button type="button" class="adm-btn adm-btn-primary" disabled={menuSaving} onclick={saveMenu}>
					{menuSaving ? 'Saxlanılır…' : 'Yadda saxla'}
				</button>
			</div>
		{/if}
	</div>
</section>

<section class="adm-panel" style="margin-bottom: 1rem;">
	<div class="adm-panel-head"><h2>Görünüş</h2></div>
	<div class="adm-panel-body-pad">
		<p style="color: var(--adm-muted); font-size: 0.875rem; margin-top: 0;">Admin panel rejimi</p>
		<div class="adm-theme-choice">
			<button
				type="button"
				class="adm-theme-option"
				class:active={adminTheme.value === 'dark'}
				onclick={() => adminTheme.set('dark')}
			>
				<span class="adm-theme-swatch adm-theme-swatch-dark"></span>
				Qaranlıq
			</button>
			<button
				type="button"
				class="adm-theme-option"
				class:active={adminTheme.value === 'light'}
				onclick={() => adminTheme.set('light')}
			>
				<span class="adm-theme-swatch adm-theme-swatch-light"></span>
				İşıqlı
			</button>
		</div>
	</div>
</section>

<div class="adm-grid-2">
	<section class="adm-panel">
		<div class="adm-panel-head"><h2>Mağaza</h2></div>
		<div class="adm-panel-body-pad">
			<p><strong>Ad:</strong> {COMPANY.name}</p>
			<p><strong>Sloqan:</strong> {COMPANY.tagline}</p>
			<p><strong>İl:</strong> {COMPANY.since}</p>
			<a href="/" class="adm-btn adm-btn-ghost" style="margin-top: 1rem;" target="_blank" rel="noopener noreferrer">Mağazanı aç</a>
		</div>
	</section>

	<section class="adm-panel">
		<div class="adm-panel-head"><h2>Admin hesabı</h2></div>
		<div class="adm-panel-body-pad">
			{#if auth.user}
				<p><strong>Ad:</strong> {auth.user.name} {auth.user.lastname}</p>
				<p><strong>E-poçt:</strong> {auth.user.email}</p>
				<p><strong>İstifadəçi:</strong> @{auth.user.username}</p>
				<p><strong>Rollar:</strong> {auth.user.roles?.length ? auth.user.roles.join(', ') : '—'}</p>
			{/if}
			<a href="/settings" class="adm-btn adm-btn-ghost" style="margin-top: 1rem;">Profil parametrləri</a>
		</div>
	</section>
</div>

<section class="adm-panel" style="margin-top: 1rem;">
	<div class="adm-panel-head"><h2>Giriş icazələri</h2></div>
	<div class="adm-panel-body-pad">
		<p style="color: var(--adm-muted); font-size: 0.875rem;">
			Admin panelə yalnız <code>ROLE_ADMIN</code> roluna malik istifadəçilər daxil ola bilər.
			Rol serverdə <code>app:user:grant-admin</code> konsol əmri ilə verilir.
		</p>
	</div>
</section>

<style>
	.adm-theme-choice {
		display: flex;
		gap: 0.75rem;
	}

	.adm-theme-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border: 2px solid var(--adm-border);
		border-radius: var(--adm-radius-sm);
		background: var(--adm-surface-2);
		color: var(--adm-text);
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.adm-theme-option.active {
		border-color: var(--adm-accent);
	}

	.adm-theme-swatch {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 5px;
		border: 1px solid var(--adm-border);
	}

	.adm-theme-swatch-dark {
		background: #0b0d13;
	}

	.adm-theme-swatch-light {
		background: #f0f2f8;
	}
</style>
