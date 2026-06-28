<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';

	let { onLogout } = $props();

	let open = $state(false);
	let menuEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	const photoUrl = $derived(resolveApiUrl(auth.user?.profilePhotoUrl));
	const displayName = $derived(auth.user?.name ?? auth.user?.username ?? 'Account');

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
	<div class="user-menu" bind:this={menuEl}>
		<button
			type="button"
			class="user-menu-trigger"
			onclick={toggle}
			aria-expanded={open}
			aria-haspopup="menu"
		>
			<span class="user-menu-avatar">
				{#if photoUrl}
					<img src={photoUrl} alt="" />
				{:else}
					<span class="avatar-placeholder">{displayName.charAt(0)}</span>
				{/if}
			</span>
			<span class="user-menu-name">{displayName}</span>
			<svg class="user-menu-chevron" class:open xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>

		{#if open}
			<div class="user-menu-dropdown" role="menu">
				<p class="user-menu-meta">@{auth.user.username}</p>
				<a href="/settings" class="user-menu-item" role="menuitem" onclick={(e) => { e.preventDefault(); goSettings(); }}>
					Settings
				</a>
				<button type="button" class="user-menu-item user-menu-item-danger" role="menuitem" onclick={logout}>
					Log out
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.user-menu {
		position: relative;
	}

	.user-menu-trigger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem 0.25rem 0.25rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: var(--color-surface);
		color: var(--color-text);
	}

	.user-menu-trigger:hover {
		background: var(--color-bg);
	}

	.user-menu-trigger:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.user-menu-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.user-menu-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-menu-avatar .avatar-placeholder {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	.user-menu-name {
		font-size: 0.875rem;
		font-weight: 500;
		max-width: 8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-menu-chevron {
		color: var(--color-muted);
		transition: transform 0.15s ease;
	}

	.user-menu-chevron.open {
		transform: rotate(180deg);
	}

	.user-menu-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 11rem;
		padding: 0.375rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: var(--shadow-md);
		z-index: 50;
	}

	.user-menu-meta {
		margin: 0;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		color: var(--color-muted);
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 0.25rem;
	}

	.user-menu-item {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: none;
		border-radius: calc(var(--radius) - 2px);
		background: transparent;
		color: var(--color-text);
		font-size: 0.875rem;
		text-align: left;
		text-decoration: none;
	}

	.user-menu-item:hover {
		background: var(--color-bg);
	}

	.user-menu-item-danger {
		color: var(--color-danger);
	}

	@media (max-width: 480px) {
		.user-menu-name {
			display: none;
		}
	}
</style>
