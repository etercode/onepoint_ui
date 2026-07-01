<script>
	import { goto } from '$app/navigation';
	import { searchSuggest } from '$lib/api/client';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';

	let query = $state('');
	let open = $state(false);
	let loading = $state(false);
	/** @type {Array<Record<string, any>>} */
	let results = $state([]);
	let suggestion = $state(/** @type {string | null} */ (null));
	let rootEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	let timer = /** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined);
	let seq = 0;

	function runSearch() {
		const q = query.trim();
		if (q.length < 2) {
			results = [];
			suggestion = null;
			loading = false;
			return;
		}
		loading = true;
		const mine = ++seq;
		searchSuggest(q, 6)
			.then((res) => {
				if (mine !== seq) return; // a newer request superseded this one
				results = res?.results ?? [];
				suggestion = res?.suggestion ?? null;
			})
			.catch(() => {
				if (mine !== seq) return;
				results = [];
				suggestion = null;
			})
			.finally(() => {
				if (mine === seq) loading = false;
			});
	}

	function onInput() {
		open = true;
		clearTimeout(timer);
		timer = setTimeout(runSearch, 200);
	}

	/** @param {SubmitEvent} event */
	function onSubmit(event) {
		event.preventDefault();
		const q = query.trim();
		if (!q) return;
		open = false;
		goto(`/search?q=${encodeURIComponent(q)}`);
	}

	/** @param {string} value */
	function applySuggestion(value) {
		query = value;
		runSearch();
	}

	function close() {
		open = false;
	}

	/** @param {MouseEvent} event */
	function onWindowClick(event) {
		if (!open || !rootEl) return;
		if (!rootEl.contains(/** @type {Node} */ (event.target))) close();
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Escape') close();
	}

	const showDropdown = $derived(open && query.trim().length >= 2);
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<div class="sb" bind:this={rootEl}>
	<form class="sb-form" role="search" action="/search" method="get" onsubmit={onSubmit}>
		<svg class="sb-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
		<input
			type="search"
			name="q"
			placeholder="Kataloqda axtar…"
			aria-label="Məhsul axtar"
			autocomplete="off"
			bind:value={query}
			oninput={onInput}
			onfocus={() => (open = true)}
		/>
		<button type="submit" class="sb-btn" aria-label="Axtar">
			<span class="sb-btn-label">Axtar</span>
			<svg class="sb-btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
		</button>
	</form>

	{#if showDropdown}
		<div class="sb-drop" role="listbox">
			{#if suggestion}
				<button type="button" class="sb-suggest" onclick={() => applySuggestion(suggestion)}>
					Bunu nəzərdə tuturdunuz: <strong>{suggestion}</strong>?
				</button>
			{/if}

			{#if results.length > 0}
				{#each results as r (r.id)}
					<a href={r.href} class="sb-result" onclick={close}>
						<span class="sb-thumb">
							{#if r.image}<img src={resolveApiUrl(r.image)} alt="" loading="lazy" />{/if}
						</span>
						<span class="sb-name">{r.name}</span>
						<span class="sb-price">{formatPrice(r.price)}</span>
					</a>
				{/each}
				<a href={`/search?q=${encodeURIComponent(query.trim())}`} class="sb-all" onclick={close}>
					“{query.trim()}” üçün bütün nəticələr →
				</a>
			{:else if loading}
				<div class="sb-empty">Axtarılır…</div>
			{:else}
				<div class="sb-empty">Nəticə tapılmadı.</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sb {
		position: relative;
		flex: 1;
		min-width: 0;
	}

	.sb-form {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.35rem 0.35rem 0.35rem 0.85rem;
		background: var(--color-surface-2, #f2f3f5);
		border: 1px solid var(--color-border, #e4e6eb);
		border-radius: 999px;
	}
	.sb-form:focus-within {
		border-color: var(--color-primary, #1d9bf0);
		background: var(--color-surface, #fff);
	}

	.sb-icon {
		flex: 0 0 auto;
		color: var(--color-muted, #666);
	}

	.sb-form input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		outline: none;
		font-size: 0.9rem;
		color: var(--color-text, #111);
	}

	.sb-btn {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 999px;
		background: var(--color-primary, #1d9bf0);
		color: #fff;
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.sb-btn-icon { display: none; }

	.sb-drop {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		z-index: 60;
		background: var(--color-surface, #fff);
		border: 1px solid var(--color-border, #e4e6eb);
		border-radius: var(--radius-lg, 16px);
		box-shadow: var(--shadow-md, 0 8px 24px rgb(0 0 0 / 0.12));
		overflow: hidden;
		padding: 0.375rem;
	}

	.sb-suggest {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.6rem 0.75rem;
		margin-bottom: 0.25rem;
		border: none;
		border-radius: 10px;
		background: color-mix(in srgb, var(--color-primary, #1d9bf0) 8%, transparent);
		color: var(--color-text, #111);
		font-size: 0.85rem;
		cursor: pointer;
	}

	.sb-result {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 10px;
		text-decoration: none;
		color: var(--color-text, #111);
	}
	.sb-result:hover { background: var(--color-surface-2, #f2f3f5); }

	.sb-thumb {
		flex: 0 0 auto;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 8px;
		overflow: hidden;
		background: #fff;
		border: 1px solid var(--color-border, #e4e6eb);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sb-thumb img { width: 100%; height: 100%; object-fit: contain; }

	.sb-name {
		flex: 1;
		min-width: 0;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.sb-price {
		flex: 0 0 auto;
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--color-primary, #1d9bf0);
	}

	.sb-all {
		display: block;
		text-align: center;
		padding: 0.6rem;
		margin-top: 0.25rem;
		border-top: 1px solid var(--color-border, #e4e6eb);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-primary, #1d9bf0);
		text-decoration: none;
	}

	.sb-empty {
		padding: 1rem;
		text-align: center;
		font-size: 0.85rem;
		color: var(--color-muted, #666);
	}

	@media (max-width: 640px) {
		.sb-btn-label { display: none; }
		.sb-btn-icon { display: inline-flex; }
		.sb-btn { padding: 0.5rem; }
	}
</style>
