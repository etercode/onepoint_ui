<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { auth } from '$lib/auth/auth.svelte';
	import { cart } from '$lib/cart/store.svelte';
	import MarketplaceHeader from '$lib/components/marketplace/MarketplaceHeader.svelte';
	import StoreFooter from '$lib/components/marketplace/StoreFooter.svelte';
	import '$lib/styles/marketplace-index.css';
	import '$lib/styles/marketplace-pages.css';

	let { data, children } = $props();

	let isNavigating = $state(false);

	onMount(() => {
		auth.init();
		cart.init();

		const unsubscribe = navigating.subscribe((nav) => {
			isNavigating = Boolean(nav?.to);
		});

		return unsubscribe;
	});

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}
</script>

<div class="mp-page" class:mp-is-navigating={isNavigating}>
	{#if data.apiUnavailable}
		<div class="mp-api-banner" role="status">
			Kataloq müvəqqəti əlçatan deyil. API işlədiyindən əmin olun (<code>VITE_API_URL</code> / <code>API_URL</code>).
		</div>
	{/if}
	<MarketplaceHeader
		categories={data.navCategories}
		collections={data.navCollections}
		catalogMenu={data.catalogMenu}
		onLogout={handleLogout}
	/>
	{@render children()}
	<StoreFooter />
</div>
