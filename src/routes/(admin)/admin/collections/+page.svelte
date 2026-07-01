<script>
	import { invalidateAll } from '$app/navigation';
	import { createCollection, deleteCollection, updateCollection, uploadCollectionImage } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { resolveApiUrl } from '$lib/config';
	import ImageCropper from '$lib/components/ImageCropper.svelte';

	let { data } = $props();

	let error = $state('');
	let saving = $state(false);
	let deletingId = $state(/** @type {number | null} */ (null));
	let editing = $state(/** @type {Record<string, unknown> | null} */ (null));
	let showForm = $state(false);

	let form = $state({ name: '', tagline: '', image: '', featured: false, sortOrder: '0' });

	// Image upload + crop staging (4:3 collection image).
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

	const collections = $derived(data.collections ?? []);

	function openCreate() {
		editing = null;
		form = { name: '', tagline: '', image: '', featured: false, sortOrder: String(collections.length) };
		clearStagedImage();
		showForm = true;
		error = '';
	}

	/** @param {Record<string, unknown>} col */
	function openEdit(col) {
		editing = col;
		form = {
			name: String(col.name ?? ''),
			tagline: String(col.tagline ?? ''),
			image: String(col.image ?? ''),
			featured: Boolean(col.featured),
			sortOrder: String(col.sortOrder ?? 0)
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
			tagline: form.tagline.trim() || null,
			image: form.image.trim() || null,
			featured: form.featured,
			sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0
		};
	}

	async function handleSubmit() {
		error = '';
		if (!form.name.trim()) {
			error = 'Kolleksiya adı tələb olunur.';
			return;
		}

		saving = true;
		try {
			const payload = buildPayload();
			const saved = editing?.id != null
				? await updateCollection(editing.id, payload)
				: await createCollection(payload);

			if (croppedFile && saved?.id != null) {
				await uploadCollectionImage(saved.id, croppedFile);
			}
			closeForm();
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			saving = false;
		}
	}

	/** @param {Record<string, unknown>} col */
	async function handleDelete(col) {
		if (!confirm(`"${col.name}" kolleksiyasını silmək istəyirsiniz?`)) return;
		error = '';
		deletingId = Number(col.id);
		try {
			await deleteCollection(col.id);
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Kolleksiyalar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Kolleksiyalar</h1>
		<p>Məhsul kolleksiyalarının idarə edilməsi</p>
	</div>
	<button type="button" class="adm-btn adm-btn-primary" onclick={openCreate}>+ Kolleksiya</button>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Kolleksiya siyahısı yüklənmədi.</div>
{/if}

{#if error && !showForm}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

{#if showForm}
	<section class="adm-panel" style="margin-bottom: 1rem;">
		<div class="adm-panel-head">
			<h2>{editing ? 'Kolleksiyanı redaktə et' : 'Yeni kolleksiya'}</h2>
			<button type="button" class="adm-btn adm-btn-ghost" onclick={closeForm}>Bağla</button>
		</div>
		<div class="adm-panel-body-pad">
			{#if error}
				<div class="adm-alert adm-alert-error" role="alert">{error}</div>
			{/if}
			<div class="adm-form-grid">
				<div class="adm-form-field adm-form-span-2">
					<label for="col-name">Ad</label>
					<input id="col-name" type="text" required bind:value={form.name} />
				</div>
				<div class="adm-form-field adm-form-span-2">
					<label for="col-tagline">Sloqan</label>
					<input id="col-tagline" type="text" bind:value={form.tagline} />
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
					<label for="col-sort">Sıra</label>
					<input id="col-sort" type="number" min="0" step="1" bind:value={form.sortOrder} />
				</div>
				<div class="adm-form-field adm-form-checks">
					<span class="adm-form-checks-label">Seçim</span>
					<label class="adm-check"><input type="checkbox" bind:checked={form.featured} /> Seçilmiş</label>
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

<div class="adm-stats" style="grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));">
	{#each collections as col}
		<article class="adm-stat">
			<div class="adm-table-product" style="margin-bottom: 0.75rem;">
				{#if col.image}
					<img src={resolveApiUrl(col.image)} alt="" style="width: 3rem; height: 3rem;" />
				{/if}
				<div>
					<strong style="font-size: 1rem;">{col.name}</strong>
					<span>{col.tagline}</span>
				</div>
			</div>
			<p class="adm-stat-value" style="font-size: 1.25rem;">{col.productCount}</p>
			<p class="adm-stat-label">məhsul · sıra {col.sortOrder ?? 0}{col.featured ? ' · seçilmiş' : ''}</p>
			<div class="adm-form-actions" style="margin-top: 0.75rem; padding-top: 0;">
				<button type="button" class="adm-btn adm-btn-ghost" onclick={() => openEdit(col)}>Redaktə</button>
				<button
					type="button"
					class="adm-btn adm-btn-ghost adm-btn-danger"
					disabled={deletingId === col.id}
					onclick={() => handleDelete(col)}
				>
					{deletingId === col.id ? '…' : 'Sil'}
				</button>
			</div>
		</article>
	{:else}
		<p class="adm-empty">Kolleksiya yoxdur.</p>
	{/each}
</div>

{#if cropFile}
	<ImageCropper
		file={cropFile}
		shape="rect"
		aspect={4 / 3}
		output={800}
		title="Kolleksiya şəklini kəs"
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
