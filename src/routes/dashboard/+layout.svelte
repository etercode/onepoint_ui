<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth/auth.svelte';

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
	<p class="subtitle" style="text-align: center; padding: 2rem;">Loading…</p>
{:else}
	<div class="dashboard">
		<header class="dashboard-header">
			<span class="brand">onepoint</span>
			<div style="display: flex; align-items: center; gap: 1rem;">
				{#if auth.user}
					<span class="user">@{auth.user.username}</span>
				{/if}
				<button type="button" class="btn btn-ghost" onclick={handleLogout}>Log out</button>
			</div>
		</header>
		<main class="dashboard-main">
			{@render children()}
		</main>
	</div>
{/if}
