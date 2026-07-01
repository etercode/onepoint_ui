<script>
	import { invalidateAll } from '$app/navigation';
	import { deleteProduct, patchProduct } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';

	let { data } = $props();

	let query = $state('');
	let categoryFilter = $state('');
	let statusFilter = $state('all');
	let sort = $state('newest');
	let error = $state('');
	let deletingId = $state(/** @type {number | null} */ (null));
	let togglingId = $state(/** @type {number | null} */ (null));
	/** @type {Record<number, boolean>} */
	let stockOverride = $state({});

	const products = $derived(data.products ?? []);
	const categories = $derived(data.categories ?? []);

	/** @param {Record<string, any>} p */
	function inStock(p) {
		return p.id in stockOverride ? stockOverride[p.id] : p.inStock !== false;
	}

	/** @param {Record<string, any>} p */
	async function toggleStock(p) {
		const next = !inStock(p);
		stockOverride = { ...stockOverride, [p.id]: next };
		togglingId = p.id;
		error = '';
		try {
			await patchProduct(p.id, { inStock: next });
		} catch (err) {
			stockOverride = { ...stockOverride, [p.id]: !next }; // revert
			error = formatAdminError(err);
		} finally {
			togglingId = null;
		}
	}

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list = products.filter((p) => {
			if (q) {
				const hay = `${p.name} ${p.category ?? ''} ${p.collection ?? ''}`.toLowerCase();
				if (!hay.includes(q)) return false;
			}
			if (categoryFilter && String(p.category) !== categoryFilter) return false;
			if (statusFilter === 'in-stock' && !inStock(p)) return false;
			if (statusFilter === 'out-of-stock' && inStock(p)) return false;
			if (statusFilter === 'on-sale' && !p.onSale) return false;
			if (statusFilter === 'new' && !p.isNew) return false;
			return true;
		});

		const sorted = [...list];
		if (sort === 'price_asc') sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
		else if (sort === 'price_desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
		else if (sort === 'name') sorted.sort((a, b) => String(a.name).localeCompare(String(b.name), 'az'));
		else if (sort === 'newest') sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
		return sorted;
	});

	/** @param {Record<string, unknown>} p */
	function imageCount(p) {
		return Array.isArray(p.images) ? p.images.length : p.image ? 1 : 0;
	}

	/** @param {number} id @param {string} name */
	async function handleDelete(id, name) {
		if (!confirm(`"${name}" məhsulunu silmək istəyirsiniz?`)) return;
		error = '';
		deletingId = id;
		try {
			await deleteProduct(id);
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			deletingId = null;
		}
	}

	function resetFilters() {
		query = '';
		categoryFilter = '';
		statusFilter = 'all';
		sort = 'newest';
	}
</script>

<svelte:head>
	<title>Məhsullar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Məhsullar</h1>
		<p>{filtered.length} / {products.length} məhsul göstərilir</p>
	</div>
	<a href="/admin/products/new" class="adm-btn adm-btn-primary">+ Məhsul əlavə et</a>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Məhsul siyahısı yüklənmədi — API əlçatan deyil.</div>
{/if}

{#if error}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

<section class="adm-panel">
	<div class="adm-filters">
		<input
			type="search"
			class="adm-filter-input"
			placeholder="Ad, kateqoriya və ya kolleksiya…"
			bind:value={query}
		/>
		<select class="adm-filter-input" bind:value={categoryFilter} aria-label="Kateqoriya">
			<option value="">Bütün kateqoriyalar</option>
			{#each categories as cat}
				<option value={cat.name}>{cat.name}</option>
			{/each}
		</select>
		<select class="adm-filter-input" bind:value={statusFilter} aria-label="Status">
			<option value="all">Bütün statuslar</option>
			<option value="in-stock">Stokda</option>
			<option value="out-of-stock">Bitib</option>
			<option value="on-sale">Endirimli</option>
			<option value="new">Yeni</option>
		</select>
		<select class="adm-filter-input" bind:value={sort} aria-label="Sıralama">
			<option value="newest">Ən yeni</option>
			<option value="price_asc">Qiymət ↑</option>
			<option value="price_desc">Qiymət ↓</option>
			<option value="name">Ad (A–Z)</option>
		</select>
		{#if query || categoryFilter || statusFilter !== 'all' || sort !== 'newest'}
			<button type="button" class="adm-btn adm-btn-ghost" onclick={resetFilters}>Sıfırla</button>
		{/if}
	</div>
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Məhsul</th>
					<th>Kateqoriya</th>
					<th>Kolleksiya</th>
					<th>Qiymət</th>
					<th>Stok</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as product (product.id)}
					<tr>
						<td>
							<div class="adm-table-product">
								<div class="adm-thumb">
									{#if product.image}
										<img src={resolveApiUrl(product.image)} alt="" />
									{:else}
										<span class="adm-thumb-empty" aria-hidden="true">—</span>
									{/if}
									{#if imageCount(product) > 1}
										<span class="adm-thumb-count" title="{imageCount(product)} şəkil">{imageCount(product)}</span>
									{/if}
								</div>
								<div>
									<strong>{product.name}</strong>
									<span class="adm-prod-meta">
										#{product.id}
										{#if product.isNew}<em class="adm-tag adm-tag-info">Yeni</em>{/if}
										{#if product.onSale}<em class="adm-tag adm-tag-sale">Endirim</em>{/if}
									</span>
								</div>
							</div>
						</td>
						<td>{product.category}</td>
						<td>{product.collection}</td>
						<td>
							<strong>{formatPrice(product.price)}</strong>
							{#if product.oldPrice}
								<span class="adm-oldprice">{formatPrice(product.oldPrice)}</span>
							{/if}
						</td>
						<td>
							<button
								type="button"
								class="adm-stock-toggle adm-pill adm-pill-{inStock(product) ? 'success' : 'danger'}"
								disabled={togglingId === product.id}
								title="Stok statusunu dəyiş"
								onclick={() => toggleStock(product)}
							>
								{inStock(product) ? 'Stokda' : 'Bitib'}
							</button>
						</td>
						<td class="adm-table-actions">
							<a href="/product/{product.id}" class="adm-btn adm-btn-ghost" target="_blank" rel="noopener noreferrer">Bax</a>
							<a href="/admin/products/{product.id}/edit" class="adm-btn adm-btn-ghost">Redaktə</a>
							<button
								type="button"
								class="adm-btn adm-btn-ghost adm-btn-danger"
								disabled={deletingId === product.id}
								onclick={() => handleDelete(product.id, product.name)}
							>
								{deletingId === product.id ? '…' : 'Sil'}
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="adm-empty">Filtrə uyğun məhsul tapılmadı.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.adm-thumb {
		position: relative;
		width: 2.75rem;
		height: 2.75rem;
		flex: 0 0 auto;
		border-radius: 8px;
		background: var(--adm-surface-2);
		border: 1px solid var(--adm-border);
		overflow: hidden;
	}

	.adm-thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 2px;
	}

	.adm-thumb-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: var(--adm-muted);
	}

	.adm-thumb-count {
		position: absolute;
		bottom: 1px;
		right: 1px;
		min-width: 1rem;
		height: 1rem;
		padding: 0 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		background: rgb(0 0 0 / 0.7);
		color: #fff;
		font-size: 0.625rem;
		font-weight: 700;
	}

	.adm-prod-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
	}

	.adm-tag {
		font-style: normal;
		padding: 0.0625rem 0.375rem;
		border-radius: 4px;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.adm-tag-info {
		background: var(--adm-info-bg);
		color: var(--adm-info);
	}

	.adm-tag-sale {
		background: var(--adm-danger-bg);
		color: var(--adm-danger);
	}

	.adm-oldprice {
		margin-left: 0.375rem;
		color: var(--adm-muted);
		text-decoration: line-through;
		font-size: 0.8125rem;
	}

	.adm-stock-toggle {
		border: none;
		cursor: pointer;
		transition: filter 0.15s ease;
	}
	.adm-stock-toggle:hover {
		filter: brightness(1.08);
	}
	.adm-stock-toggle:disabled {
		opacity: 0.6;
		cursor: default;
	}
</style>
