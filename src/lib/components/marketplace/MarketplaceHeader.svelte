<script>
	import { auth } from '$lib/auth/auth.svelte';
	import { COMPANY } from '$lib/data/marketplace';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import CartButton from '$lib/components/marketplace/CartButton.svelte';
	import CatalogMenu from '$lib/components/marketplace/CatalogMenu.svelte';

	let { onLogout = async () => {} } = $props();

	let catalogOpen = $state(false);
</script>

<header class="mp-header">
	<div class="mp-header-inner">
		<a href="/" class="mp-logo">
			<span class="mp-logo-mark">O</span>
			<span class="mp-logo-text">{COMPANY.name}<span class="mp-logo-sub">{COMPANY.tagline}</span></span>
		</a>

		<CatalogMenu bind:open={catalogOpen} />

		<form class="mp-search" role="search" action="/search" method="get">
			<svg class="mp-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
			<input type="search" name="q" placeholder="Kataloqda axtar…" aria-label="Məhsul axtar" />
			<button type="submit" class="mp-search-btn">Axtar</button>
		</form>

		<div class="mp-header-actions">
			<CartButton />
			{#if auth.isAuthenticated}
				<UserMenu onLogout={onLogout} />
			{:else}
				<a href="/login" class="mp-link-btn">Daxil ol</a>
				<a href="/register" class="mp-primary-btn">Qeydiyyat</a>
			{/if}
		</div>
	</div>
</header>
