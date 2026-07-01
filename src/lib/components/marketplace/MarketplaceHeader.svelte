<script>
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/auth/auth.svelte';
	import { COMPANY } from '$lib/data/marketplace';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import BackButton from '$lib/components/marketplace/BackButton.svelte';
	import CartButton from '$lib/components/marketplace/CartButton.svelte';
	import CatalogMenu from '$lib/components/marketplace/CatalogMenu.svelte';
	import SearchBox from '$lib/components/marketplace/SearchBox.svelte';

	let { categories = [], collections = [], catalogMenu = null, onLogout = async () => {} } = $props();

	let catalogOpen = $state(false);

	const pathname = $derived($page.url.pathname);
	const showBack = $derived(pathname !== '/' && !pathname.startsWith('/admin'));

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

			<CatalogMenu {categories} {collections} {catalogMenu} bind:open={catalogOpen} />

			<SearchBox />

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
</header>
