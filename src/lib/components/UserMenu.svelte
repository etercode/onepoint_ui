<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';

	let { onLogout } = $props();

	let open = $state(false);
	let menuEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	const photoUrl = $derived(resolveApiUrl(auth.user?.profilePhotoUrl));
	const displayName = $derived(auth.user?.name ?? auth.user?.username ?? 'Hesab');

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	/** @param {MouseEvent} event */
	function handleWindowClick(event) {
		if (!open || !menuEl) return;
		if (!menuEl.contains(/** @type {Node} */ (event.target))) {
			close();
		}
	}

	/** @param {KeyboardEvent} event */
	function handleWindowKeydown(event) {
		if (event.key === 'Escape') close();
	}

	function goSettings() {
		close();
		goto('/settings');
	}

	async function logout() {
		close();
		await onLogout();
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

{#if auth.user}
	<div class="mp-user-menu" bind:this={menuEl}>
		<button
			type="button"
			class="mp-user-menu-trigger"
			onclick={toggle}
			aria-expanded={open}
			aria-haspopup="menu"
		>
			<span class="mp-user-menu-avatar">
				{#if photoUrl}
					<img src={photoUrl} alt="" />
				{:else}
					<span class="mp-user-menu-initial">{displayName.charAt(0)}</span>
				{/if}
			</span>
			<span class="mp-user-menu-name">{displayName}</span>
			<svg class="mp-user-menu-chevron" class:open xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>

		{#if open}
			<div class="mp-user-menu-dropdown" role="menu">
				<div class="mp-user-menu-header">
					<span class="mp-user-menu-avatar mp-user-menu-avatar-lg">
						{#if photoUrl}
							<img src={photoUrl} alt="" />
						{:else}
							<span class="mp-user-menu-initial">{displayName.charAt(0)}</span>
						{/if}
					</span>
					<div>
						<strong>{displayName}</strong>
						<p>@{auth.user.username}</p>
					</div>
				</div>
				<a href="/settings" class="mp-user-menu-item" role="menuitem" onclick={(e) => { e.preventDefault(); goSettings(); }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
					Hesab parametrləri
				</a>
				<a href="/cart" class="mp-user-menu-item" role="menuitem" onclick={close}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
					Səbətim
				</a>
				<button type="button" class="mp-user-menu-item mp-user-menu-item-danger" role="menuitem" onclick={logout}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
					Çıxış
				</button>
			</div>
		{/if}
	</div>
{/if}
