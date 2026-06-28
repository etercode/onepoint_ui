<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth/auth.svelte';
	import MarketplaceHeader from '$lib/components/marketplace/MarketplaceHeader.svelte';
	import StoreFooter from '$lib/components/marketplace/StoreFooter.svelte';
	import '$lib/styles/marketplace-index.css';
	import '$lib/styles/marketplace-pages.css';

	let { children } = $props();

	onMount(async () => {
		await auth.init();
		if (!auth.isAuthenticated) goto('/login');
	});

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}
</script>

{#if browser && !auth.isAuthenticated}
	<p class="loading-screen">Yüklənir…</p>
{:else}
	<div class="mp-page">
		<MarketplaceHeader onLogout={handleLogout} />
		<main class="mp-settings-main">
			{@render children()}
		</main>
		<StoreFooter />
	</div>
{/if}
