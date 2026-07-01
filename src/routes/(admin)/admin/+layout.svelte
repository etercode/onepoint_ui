<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth/auth.svelte';
	import { isAdminUser } from '$lib/admin/config';
	import { adminTheme } from '$lib/admin/theme.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import '$lib/styles/admin.css';

	let { children } = $props();

	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	onMount(async () => {
		adminTheme.init();
		await auth.init();
	});

	$effect(() => {
		if (!browser || isLoginPage) return;
		if (!auth.initialized) return;

		if (!auth.isAuthenticated) {
			goto('/admin/login');
			return;
		}

		if (auth.user && !isAdminUser(auth.user)) {
			goto('/');
		}
	});

	async function handleLogout() {
		await auth.logout();
		goto('/admin/login');
	}
</script>

{#if isLoginPage}
	<div class="adm-app" data-theme={adminTheme.value}>
		{@render children()}
	</div>
{:else if browser && (!auth.initialized || !auth.isAuthenticated || (auth.user && !isAdminUser(auth.user)))}
	<div class="adm-app adm-empty" data-theme={adminTheme.value}>Yüklənir…</div>
{:else}
	<div class="adm-app" data-theme={adminTheme.value}>
		<AdminShell onLogout={handleLogout}>
			{@render children()}
		</AdminShell>
	</div>
{/if}
