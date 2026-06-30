<script>
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/auth/auth.svelte';
	import { COMPANY } from '$lib/data/marketplace';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import BackButton from '$lib/components/marketplace/BackButton.svelte';
	import CartButton from '$lib/components/marketplace/CartButton.svelte';
	import CatalogMenu from '$lib/components/marketplace/CatalogMenu.svelte';

	let { categories = [], collections = [], onLogout = async () => {} } = $props();

	let catalogOpen = $state(false);

	const pathname = $derived($page.url.pathname);
	const showBack = $derived(pathname !== '/' && !pathname.startsWith('/admin'));
	const showMobileBanner = $derived(
		pathname !== '/' && !pathname.startsWith('/category/')
	);

	beforeNavigate(() => {
		catalogOpen = false;
	});
</script>

<header class="mp-header">
	<div class="mp-header-shell">
		<div class="mp-header-inner">
			{#if showBack}
				<BackButton />
			{/if}
			<a href="/" class="mp-logo">
				<span class="mp-logo-mark">M</span>
				<span class="mp-logo-text">
					{COMPANY.name}
					<span class="mp-logo-sub">{COMPANY.tagline}</span>
				</span>
			</a>

			<CatalogMenu {categories} {collections} bind:open={catalogOpen} />

			<form class="mp-search" role="search" action="/search" method="get">
				<svg class="mp-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
				<input type="search" name="q" placeholder="Kataloqda axtar…" aria-label="Məhsul axtar" />
				<button type="submit" class="mp-search-btn" aria-label="Axtar">
					<span class="mp-search-btn-label">Axtar</span>
					<svg class="mp-search-btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
				</button>
			</form>

			<div class="mp-header-actions">
				<CartButton />
				{#if auth.isAuthenticated}
					<UserMenu onLogout={onLogout} />
				{:else}
					<a href="/login" class="mp-link-btn mp-header-login">Daxil ol</a>
					<a href="/register" class="mp-primary-btn mp-header-register">Qeydiyyat</a>
				{/if}
			</div>
		</div>
	</div>

	{#if showMobileBanner}
		<a href="/catalog" class="mp-header-banner">
			<img
				src="https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png"
				alt=""
				loading="lazy"
			/>
			<div class="mp-header-banner-overlay">
				<p class="mp-header-banner-eyebrow">{COMPANY.name}</p>
				<p class="mp-header-banner-title">Premium mebel kolleksiyası</p>
				<span class="mp-header-banner-cta">Kataloqa bax →</span>
			</div>
		</a>
	{/if}
</header>
