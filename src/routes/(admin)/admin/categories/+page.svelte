<script>
	import { invalidateAll } from '$app/navigation';
	import { createCategory, deleteCategory, updateCategory } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';

	let { data } = $props();

	let error = $state('');
	let saving = $state(false);
	let deletingId = $state(/** @type {number | null} */ (null));
	let editing = $state(/** @type {Record<string, unknown> | null} */ (null));
	let showForm = $state(false);

	let form = $state({ name: '', image: '', sortOrder: '0' });

	const categories = $derived(data.categories ?? []);

	function openCreate() {
		editing = null;
		form = { name: '', image: '', sortOrder: String(categories.length) };
		showForm = true;
		error = '';
	}

	/** @param {Record<string, unknown>} cat */
	function openEdit(cat) {
		editing = cat;
		form = {
			name: String(cat.name ?? ''),
			image: String(cat.image ?? ''),
			sortOrder: String(cat.sortOrder ?? 0)
		};
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		editing = null;
	}

	function buildPayload() {
		const sortOrder = parseInt(form.sortOrder, 10);
		return {
			name: form.name.trim(),
			image: form.image.trim() || null,
			sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0
		};
	}

	async function handleSubmit() {
		error = '';
		if (!form.name.trim()) {
			error = 'Kateqoriya adı tələb olunur.';
			return;
		}

		saving = true;
		try {
			const payload = buildPayload();
			if (editing?.id != null) {
				await updateCategory(editing.id, payload);
			} else {
				await createCategory(payload);
			}
			closeForm();
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			saving = false;
		}
	}

	/** @param {Record<string, unknown>} cat */
	async function handleDelete(cat) {
		if (!confirm(`"${cat.name}" kateqoriyasını silmək istəyirsiniz?`)) return;
		error = '';
		deletingId = Number(cat.id);
		try {
			await deleteCategory(cat.id);
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Kateqoriyalar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Kateqoriyalar</h1>
		<p>Mağaza kateqoriya strukturu</p>
	</div>
	<button type="button" class="adm-btn adm-btn-primary" onclick={openCreate}>+ Kateqoriya</button>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Kateqoriya siyahısı yüklənmədi.</div>
{/if}

{#if error && !showForm}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

{#if showForm}
	<section class="adm-panel" style="margin-bottom: 1rem;">
		<div class="adm-panel-head">
			<h2>{editing ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya'}</h2>
			<button type="button" class="adm-btn adm-btn-ghost" onclick={closeForm}>Bağla</button>
		</div>
		<div class="adm-panel-body-pad">
			{#if error}
				<div class="adm-alert adm-alert-error" role="alert">{error}</div>
			{/if}
			<div class="adm-form-grid">
				<div class="adm-form-field adm-form-span-2">
					<label for="cat-name">Ad</label>
					<input id="cat-name" type="text" required bind:value={form.name} />
				</div>
				<div class="adm-form-field adm-form-span-2">
					<label for="cat-image">Şəkil URL</label>
					<input id="cat-image" type="text" bind:value={form.image} />
				</div>
				<div class="adm-form-field">
					<label for="cat-sort">Sıra</label>
					<input id="cat-sort" type="number" min="0" step="1" bind:value={form.sortOrder} />
				</div>
			</div>
			<div class="adm-form-actions">
				<button type="button" class="adm-btn adm-btn-primary" disabled={saving} onclick={handleSubmit}>
					{saving ? 'Saxlanılır…' : editing ? 'Yenilə' : 'Yarat'}
				</button>
			</div>
		</div>
	</section>
{/if}

<section class="adm-panel">
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Kateqoriya</th>
					<th>Məhsul sayı</th>
					<th>Min. qiymət</th>
					<th>Sıra</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each categories as cat}
					<tr>
						<td>
							<div class="adm-table-product">
								{#if cat.image}
									<img src={resolveApiUrl(cat.image)} alt="" />
								{/if}
								<div><strong>{cat.name}</strong></div>
							</div>
						</td>
						<td>{cat.productCount}</td>
						<td>{cat.priceFrom != null ? formatPrice(cat.priceFrom) : '—'}</td>
						<td>{cat.sortOrder ?? 0}</td>
						<td class="adm-table-actions">
							<button type="button" class="adm-btn adm-btn-ghost" onclick={() => openEdit(cat)}>Redaktə</button>
							<button
								type="button"
								class="adm-btn adm-btn-ghost adm-btn-danger"
								disabled={deletingId === cat.id}
								onclick={() => handleDelete(cat)}
							>
								{deletingId === cat.id ? '…' : 'Sil'}
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="adm-empty">Kateqoriya yoxdur.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
