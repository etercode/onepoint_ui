<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth/auth.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';

	let { children } = $props();

	onMount(async () => {
		await auth.init();
		if (!auth.isAuthenticated) {
			goto('/login');
		}
	});

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}
</script>

{#if browser && !auth.isAuthenticated}
	<p class="loading-screen">Loading…</p>
{:else}
	<div class="app-shell">
		<header class="app-header">
			<a href="/" class="brand">onepoint</a>
			<UserMenu onLogout={handleLogout} />
		</header>
		<main class="app-main">
			{@render children()}
		</main>
	</div>
{/if}
