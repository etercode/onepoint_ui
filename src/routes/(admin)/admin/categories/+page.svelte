<script>
	import { invalidateAll } from '$app/navigation';
	import { createCategory, deleteCategory, updateCategory, uploadCategoryImage } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';
	import CategoryAttributeEditor from '$lib/components/admin/CategoryAttributeEditor.svelte';
	import ImageCropper from '$lib/components/ImageCropper.svelte';

	let { data } = $props();

	let attributesFor = $state(/** @type {Record<string, any> | null} */ (null));

	// Image upload + crop staging (4:3 category image).
	let cropFile = $state(/** @type {File | null} */ (null));
	let croppedFile = $state(/** @type {File | null} */ (null));
	let croppedPreview = $state('');

	/** @param {Event} event */
	function handleImageSelect(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (file) cropFile = file;
	}

	/** @param {File} file */
	function onCropConfirm(file) {
		croppedFile = file;
		if (croppedPreview) URL.revokeObjectURL(croppedPreview);
		croppedPreview = URL.createObjectURL(file);
		cropFile = null;
	}

	function clearStagedImage() {
		if (croppedPreview) URL.revokeObjectURL(croppedPreview);
		croppedFile = null;
		croppedPreview = '';
		cropFile = null;
	}

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
		clearStagedImage();
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
		clearStagedImage();
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		editing = null;
		clearStagedImage();
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
			const saved = editing?.id != null
				? await updateCategory(editing.id, payload)
				: await createCategory(payload);

			// Upload the cropped image (if any) once the category exists.
			if (croppedFile && saved?.id != null) {
				await uploadCategoryImage(saved.id, croppedFile);
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
					<span class="adm-form-checks-label">Şəkil</span>
					<div class="adm-cat-image">
						<div class="adm-cat-image-preview">
							{#if croppedPreview}
								<img src={croppedPreview} alt="" />
							{:else if form.image}
								<img src={resolveApiUrl(form.image)} alt="" />
							{:else}
								<span class="adm-cat-image-empty">Şəkil yoxdur</span>
							{/if}
						</div>
						<div class="adm-cat-image-controls">
							<label class="adm-btn adm-btn-ghost adm-file-btn">
								Şəkil seç və kəs
								<input type="file" accept="image/*" onchange={handleImageSelect} hidden />
							</label>
							{#if croppedFile}
								<button type="button" class="adm-btn adm-btn-ghost adm-btn-danger" onclick={clearStagedImage}>Ləğv et</button>
							{/if}
							<input
								type="text"
								class="adm-filter-input"
								placeholder="və ya şəkil URL-i yapışdırın"
								bind:value={form.image}
							/>
						</div>
					</div>
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

{#if attributesFor}
	<CategoryAttributeEditor
		categoryId={attributesFor.id}
		categoryName={attributesFor.name}
		onClose={() => (attributesFor = null)}
	/>
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
							<button type="button" class="adm-btn adm-btn-ghost" onclick={() => (attributesFor = cat)}>Xüsusiyyətlər</button>
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

{#if cropFile}
	<ImageCropper
		file={cropFile}
		shape="rect"
		aspect={4 / 3}
		output={800}
		title="Kateqoriya şəklini kəs"
		subtitle="Yerini dəyişmək üçün sürükləyin · böyütmək üçün zoom"
		onConfirm={onCropConfirm}
		onCancel={() => (cropFile = null)}
	/>
{/if}

<style>
	.adm-cat-image {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.adm-cat-image-preview {
		flex: 0 0 8rem;
		width: 8rem;
		aspect-ratio: 4 / 3;
		border: 1px solid var(--adm-border);
		border-radius: var(--adm-radius-sm);
		background: var(--adm-surface-2);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.adm-cat-image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.adm-cat-image-empty {
		font-size: 0.75rem;
		color: var(--adm-muted);
	}

	.adm-cat-image-controls {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.adm-cat-image-controls .adm-filter-input {
		width: 100%;
	}

	.adm-file-btn {
		cursor: pointer;
	}
</style>
