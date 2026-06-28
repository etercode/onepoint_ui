<script>
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';

	let {
		title = 'İdarə paneli',
		subtitle = '',
		onMenuToggle = () => {},
		onLogout = async () => {}
	} = $props();

	const photoUrl = $derived(resolveApiUrl(auth.user?.profilePhotoUrl));
	const displayName = $derived(auth.user?.name ?? auth.user?.username ?? 'Admin');
</script>

<header class="adm-topbar">
	<div class="adm-topbar-left">
		<button type="button" class="adm-icon-btn adm-mobile-toggle" aria-label="Menyu" onclick={onMenuToggle}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
		</button>
		<div>
			<h1 class="adm-topbar-title">{title}</h1>
			{#if subtitle}
				<p class="adm-topbar-sub">{subtitle}</p>
			{/if}
		</div>
	</div>

	<div class="adm-topbar-actions">
		<div class="adm-search">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
			<input type="search" placeholder="Axtar…" aria-label="Admin axtarış" />
			<kbd>⌘K</kbd>
		</div>
		<a href="/" class="adm-icon-btn" aria-label="Mağaza" target="_blank" rel="noopener noreferrer">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
		</a>
		<div class="adm-user-chip">
			<span class="adm-user-avatar">
				{#if photoUrl}
					<img src={photoUrl} alt="" />
				{:else}
					{displayName.charAt(0)}
				{/if}
			</span>
			<span>{displayName}</span>
		</div>
		<button type="button" class="adm-btn adm-btn-ghost" onclick={onLogout}>Çıxış</button>
	</div>
</header>
