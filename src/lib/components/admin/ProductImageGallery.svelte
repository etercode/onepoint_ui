<script>
	import { invalidateAll } from '$app/navigation';
	import {
		addProductImageUrl,
		deleteProductImage,
		reorderProductImages,
		uploadProductImage
	} from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { resolveApiUrl } from '$lib/config';

	/** @type {{
	 *   productId: number | string,
	 *   images?: Array<{ id: number, url: string, sortOrder?: number }>
	 * }} */
	let { productId, images: initialImages = [] } = $props();

	/** @type {Array<{ id: number, url: string, sortOrder?: number }>} */
	let images = $state([]);
	let imageUrl = $state('');
	let error = $state('');
	let busy = $state(false);
	let dragIndex = $state(/** @type {number | null} */ (null));

	$effect(() => {
		images = [...initialImages];
	});

	/** @param {Array<{ id: number, url: string, sortOrder?: number }>} next */
	function syncImages(next) {
		images = next;
	}

	async function refreshFromProduct() {
		await invalidateAll();
	}

	async function handleAddUrl() {
		const url = imageUrl.trim();
		if (!url) return;
		error = '';
		busy = true;
		try {
			await addProductImageUrl(productId, url);
			imageUrl = '';
			await refreshFromProduct();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			busy = false;
		}
	}

	/** @param {Event} event */
	async function handleUpload(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;

		error = '';
		busy = true;
		try {
			await uploadProductImage(productId, file);
			await refreshFromProduct();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			busy = false;
		}
	}

	/** @param {number} imageId */
	async function handleDelete(imageId) {
		if (!confirm('Bu şəkli silmək istəyirsiniz?')) return;
		error = '';
		busy = true;
		try {
			await deleteProductImage(productId, imageId);
			await refreshFromProduct();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			busy = false;
		}
	}

	/** @param {number} from @param {number} to */
	async function moveImage(from, to) {
		if (from === to || from < 0 || to < 0 || from >= images.length || to >= images.length) return;

		const next = [...images];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		syncImages(next);

		error = '';
		busy = true;
		try {
			const updated = await reorderProductImages(
				productId,
				next.map((img) => img.id)
			);
			if (updated?.images) {
				syncImages(updated.images);
			} else {
				await refreshFromProduct();
			}
		} catch (err) {
			error = formatAdminError(err);
			await refreshFromProduct();
		} finally {
			busy = false;
		}
	}

	/** @param {DragEvent} event @param {number} index */
	function onDragStart(event, index) {
		dragIndex = index;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', String(index));
		}
	}

	/** @param {DragEvent} event */
	function onDragOver(event) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	}

	/** @param {DragEvent} event @param {number} index */
	function onDrop(event, index) {
		event.preventDefault();
		if (dragIndex === null) return;
		const from = dragIndex;
		dragIndex = null;
		moveImage(from, index);
	}
</script>

<div class="adm-gallery">
	<h3 class="adm-gallery-title">Şəkil qalereyası</h3>
	<p class="adm-gallery-hint">Sürükləyərək sıranı dəyişin. Birinci şəkil əsas şəkildir.</p>

	{#if error}
		<div class="adm-alert adm-alert-error" role="alert">{error}</div>
	{/if}

	{#if images.length > 0}
		<div class="adm-gallery-grid" class:adm-gallery-busy={busy} role="list">
			{#each images as img, i}
				<div
					class="adm-gallery-item"
					class:adm-gallery-item-primary={i === 0}
					role="listitem"
					draggable={!busy}
					ondragstart={(e) => onDragStart(e, i)}
					ondragover={onDragOver}
					ondrop={(e) => onDrop(e, i)}
				>
					<img src={resolveApiUrl(img.url)} alt="" />
					{#if i === 0}
						<span class="adm-gallery-badge">Əsas</span>
					{/if}
					<button
						type="button"
						class="adm-gallery-delete"
						disabled={busy}
						aria-label="Şəkli sil"
						onclick={() => handleDelete(img.id)}
					>×</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="adm-empty">Hələ şəkil yoxdur.</p>
	{/if}

	<div class="adm-gallery-add">
		<div class="adm-form-field">
			<label for="gallery-url">URL ilə əlavə et</label>
			<div class="adm-gallery-url-row">
				<input
					id="gallery-url"
					type="url"
					placeholder="https://…"
					bind:value={imageUrl}
					disabled={busy}
				/>
				<button type="button" class="adm-btn adm-btn-ghost" disabled={busy || !imageUrl.trim()} onclick={handleAddUrl}>
					Əlavə et
				</button>
			</div>
		</div>
		<div class="adm-form-field">
			<label for="gallery-file">Fayl yüklə</label>
			<input id="gallery-file" type="file" accept="image/*" disabled={busy} onchange={handleUpload} />
		</div>
	</div>
</div>

<style>
	.adm-gallery-title {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 800;
	}

	.adm-gallery-hint {
		margin: 0 0 1rem;
		font-size: 0.8125rem;
		color: var(--adm-muted);
	}

	.adm-gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.adm-gallery-busy {
		opacity: 0.6;
		pointer-events: none;
	}

	.adm-gallery-item {
		position: relative;
		border: 2px solid var(--adm-border);
		border-radius: var(--adm-radius-sm);
		background: var(--adm-surface-2);
		cursor: grab;
		overflow: hidden;
	}

	.adm-gallery-item-primary {
		border-color: var(--adm-accent);
	}

	.adm-gallery-item img {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		object-fit: contain;
		padding: 0.375rem;
	}

	.adm-gallery-badge {
		position: absolute;
		bottom: 0.375rem;
		left: 0.375rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		background: var(--adm-accent);
		color: #fff;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.adm-gallery-delete {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		border-radius: 50%;
		background: rgb(0 0 0 / 0.55);
		color: #fff;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
	}

	.adm-gallery-url-row {
		display: flex;
		gap: 0.5rem;
	}

	.adm-gallery-url-row input {
		flex: 1;
	}
</style>
