<script>
	import { COMPANY } from '$lib/data/marketplace';
	import { auth } from '$lib/auth/auth.svelte';
</script>

<svelte:head>
	<title>Parametrlər — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Parametrlər</h1>
		<p>Admin panel və mağaza konfiqurasiyası</p>
	</div>
</div>

<div class="adm-grid-2">
	<section class="adm-panel">
		<div class="adm-panel-head"><h2>Mağaza</h2></div>
		<div class="adm-panel-body-pad">
			<p><strong>Ad:</strong> {COMPANY.name}</p>
			<p><strong>Sloqan:</strong> {COMPANY.tagline}</p>
			<p><strong>İl:</strong> {COMPANY.since}</p>
			<a href="/" class="adm-btn adm-btn-ghost" style="margin-top: 1rem;" target="_blank" rel="noopener noreferrer">Mağazanı aç</a>
		</div>
	</section>

	<section class="adm-panel">
		<div class="adm-panel-head"><h2>Admin hesabı</h2></div>
		<div class="adm-panel-body-pad">
			{#if auth.user}
				<p><strong>Ad:</strong> {auth.user.name} {auth.user.lastname}</p>
				<p><strong>E-poçt:</strong> {auth.user.email}</p>
				<p><strong>İstifadəçi:</strong> @{auth.user.username}</p>
				<p><strong>Rollar:</strong> {auth.user.roles?.length ? auth.user.roles.join(', ') : '—'}</p>
			{/if}
			<a href="/settings" class="adm-btn adm-btn-ghost" style="margin-top: 1rem;">Profil parametrləri</a>
		</div>
	</section>
</div>

<section class="adm-panel" style="margin-top: 1rem;">
	<div class="adm-panel-head"><h2>Giriş icazələri</h2></div>
	<div class="adm-panel-body-pad">
		<p style="color: var(--adm-muted); font-size: 0.875rem;">
			Admin panelə yalnız <code>ROLE_ADMIN</code> roluna malik istifadəçilər daxil ola bilər.
			Rol serverdə <code>app:user:grant-admin</code> konsol əmri ilə verilir.
		</p>
	</div>
</section>
