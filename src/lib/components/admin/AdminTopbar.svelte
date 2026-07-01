<script>
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';
	import { adminTheme } from '$lib/admin/theme.svelte';

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
		<button
			type="button"
			class="adm-icon-btn"
			aria-label={adminTheme.value === 'dark' ? 'İşıqlı rejim' : 'Qaranlıq rejim'}
			title={adminTheme.value === 'dark' ? 'İşıqlı rejim' : 'Qaranlıq rejim'}
			onclick={() => adminTheme.toggle()}
		>
			{#if adminTheme.value === 'dark'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
			{/if}
		</button>
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
