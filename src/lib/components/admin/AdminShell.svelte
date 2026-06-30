<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminTopbar from '$lib/components/admin/AdminTopbar.svelte';

	let {
		subtitle = '',
		onLogout = async () => {},
		children
	} = $props();

	let sidebarOpen = $state(false);
</script>

<div class="adm-shell">
	<AdminSidebar open={sidebarOpen} onClose={() => (sidebarOpen = false)} />
	<div class="adm-main">
		<AdminTopbar
			title="Mirvari Mebel Admin"
			{subtitle}
			onMenuToggle={() => (sidebarOpen = !sidebarOpen)}
			{onLogout}
		/>
		<main class="adm-content">
			{@render children()}
		</main>
	</div>
</div>
