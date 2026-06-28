<script>
	import { page } from '$app/stores';

	const nav = [
		{
			label: 'Əsas',
			items: [
				{ href: '/admin', label: 'İdarə paneli', icon: 'dashboard', exact: true },
				{ href: '/admin/analytics', label: 'Analitika', icon: 'chart' }
			]
		},
		{
			label: 'Ticarət',
			items: [
				{ href: '/admin/products', label: 'Məhsullar', icon: 'box' },
				{ href: '/admin/orders', label: 'Sifarişlər', icon: 'cart' },
				{ href: '/admin/customers', label: 'Müştərilər', icon: 'users' },
				{ href: '/admin/consultations', label: 'Konsultasiyalar', icon: 'message' }
			]
		},
		{
			label: 'Məzmun',
			items: [
				{ href: '/admin/collections', label: 'Kolleksiyalar', icon: 'layers' },
				{ href: '/admin/categories', label: 'Kateqoriyalar', icon: 'grid' }
			]
		},
		{
			label: 'Sistem',
			items: [{ href: '/admin/settings', label: 'Parametrlər', icon: 'settings' }]
		}
	];

	let { open = false, onClose = () => {} } = $props();

	/** @param {string} href @param {boolean} [exact] */
	function isActive(href, exact = false) {
		const path = $page.url.pathname;
		if (exact) return path === href;
		return path === href || path.startsWith(`${href}/`);
	}
</script>

{#if open}
	<button type="button" class="adm-sidebar-overlay" aria-label="Menunu bağla" onclick={onClose}></button>
{/if}

<aside class="adm-sidebar" class:open>
	<div class="adm-sidebar-brand">
		<span class="adm-sidebar-mark">OP</span>
		<div>
			<strong>onepoint</strong>
			<span>Admin panel</span>
		</div>
	</div>

	<nav class="adm-sidebar-nav">
		{#each nav as group}
			<div class="adm-nav-group">
				<div class="adm-nav-label">{group.label}</div>
				{#each group.items as item}
					<a
						href={item.href}
						class="adm-nav-link"
						class:active={isActive(item.href, item.exact)}
						onclick={onClose}
					>
						{#if item.icon === 'dashboard'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
						{:else if item.icon === 'chart'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
						{:else if item.icon === 'box'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
						{:else if item.icon === 'cart'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
						{:else if item.icon === 'users'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						{:else if item.icon === 'message'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
						{:else if item.icon === 'layers'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
						{:else if item.icon === 'grid'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
						{/if}
						{item.label}
					</a>
				{/each}
			</div>
		{/each}
	</nav>

	<div class="adm-sidebar-footer">
		<a href="/" class="adm-store-link" target="_blank" rel="noopener noreferrer">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
			Mağazaya bax
		</a>
	</div>
</aside>
