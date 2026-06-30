<script>
	import { invalidateAll } from '$app/navigation';
	import { deleteProduct } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';

	let { data } = $props();

	let query = $state('');
	let error = $state('');
	let deletingId = $state(/** @type {number | null} */ (null));

	const products = $derived(data.products ?? []);

	const filtered = $derived(
		query.trim()
			? products.filter((p) =>
					p.name.toLowerCase().includes(query.toLowerCase()) ||
					String(p.category ?? '').toLowerCase().includes(query.toLowerCase()) ||
					String(p.collection ?? '').toLowerCase().includes(query.toLowerCase())
				)
			: products
	);

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
</script>

<svelte:head>
	<title>Məhsullar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Məhsullar</h1>
		<p>{products.length} məhsul kataloqda</p>
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
				{#each filtered as product}
					<tr>
						<td>
							<div class="adm-table-product">
								{#if product.image}
									<img src={resolveApiUrl(product.image)} alt="" />
								{/if}
								<div>
									<strong>{product.name}</strong>
									<span>#{product.id}</span>
								</div>
							</div>
						</td>
						<td>{product.category}</td>
						<td>{product.collection}</td>
						<td><strong>{formatPrice(product.price)}</strong></td>
						<td>
							<span class="adm-pill adm-pill-{product.inStock ? 'success' : 'danger'}">
								{product.inStock ? 'Stokda' : 'Bitib'}
							</span>
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
						<td colspan="6" class="adm-empty">Məhsul tapılmadı.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
