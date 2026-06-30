<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth/auth.svelte';
	import { cart } from '$lib/cart/store.svelte';
	import MarketplaceHeader from '$lib/components/marketplace/MarketplaceHeader.svelte';
	import StoreFooter from '$lib/components/marketplace/StoreFooter.svelte';
	import '$lib/styles/marketplace-index.css';
	import '$lib/styles/marketplace-pages.css';

	let { data, children } = $props();

	onMount(() => {
		auth.init();
		cart.init();
	});

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}
</script>

<div class="mp-page">
	<MarketplaceHeader
		categories={data.navCategories}
		collections={data.navCollections}
		onLogout={handleLogout}
	/>
	{@render children()}
	<StoreFooter />
</div>
