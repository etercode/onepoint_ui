<script>
	import { goto, invalidateAll } from '$app/navigation';
	import {
		addProductImageUrl,
		createProduct,
		updateProduct,
		uploadProductImage
	} from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import ProductImageStager from '$lib/components/admin/ProductImageStager.svelte';
	import ProductAttributeFields from '$lib/components/admin/ProductAttributeFields.svelte';

	/** @type {{
	 *   product?: Record<string, unknown> | null,
	 *   categories: Array<Record<string, unknown>>,
	 *   collections: Array<Record<string, unknown>>
	 * }} */
	let { product = null, categories = [], collections = [] } = $props();

	const isEdit = $derived(Boolean(product?.id));

	/** @param {Record<string, unknown> | null | undefined} p */
	function toForm(p) {
		return {
			name: String(p?.name ?? ''),
			price: p?.price != null ? String(p.price) : '',
			categoryId: p?.categoryId != null ? String(p.categoryId) : '',
			collectionId: p?.collectionId != null ? String(p.collectionId) : '',
			oldPrice: p?.oldPrice != null ? String(p.oldPrice) : '',
			isNew: Boolean(p?.isNew),
			inStock: p?.inStock !== false,
			freeDelivery: Boolean(p?.freeDelivery),
			warrantyYears: p?.warrantyYears != null ? String(p.warrantyYears) : '2',
			description: String(p?.description ?? '')
		};
	}

	/** @param {Record<string, unknown> | null | undefined} p */
	function toAttrValues(p) {
		/** @type {Record<string, unknown>} */
		const out = {};
		if (Array.isArray(p?.specs)) {
			for (const spec of p.specs) {
				if (spec?.code != null) out[spec.code] = spec.raw ?? '';
			}
		}
		return out;
	}

	let form = $state(toForm(null));
	/** @type {Record<string, unknown>} */
	let attrValues = $state({});
	let error = $state('');
	let submitting = $state(false);
	/** @type {import('svelte').ComponentProps<typeof ProductImageStager>['items']} */
	let stagedImages = $state([]);
	let uploadProgress = $state({ done: 0, total: 0 });

	$effect(() => {
		form = toForm(product);
		attrValues = toAttrValues(product);
	});

	function buildPayload() {
		const price = parseInt(form.price, 10);
		const categoryId = parseInt(form.categoryId, 10);
		const collectionId = parseInt(form.collectionId, 10);
		const oldPriceRaw = String(form.oldPrice ?? '').trim();
		const warrantyYears = parseInt(form.warrantyYears, 10);

		return {
			name: form.name.trim(),
			price,
			categoryId,
			collectionId,
			oldPrice: oldPriceRaw ? parseInt(oldPriceRaw, 10) : null,
			onSale: form.onSale,
			isNew: form.isNew,
			inStock: form.inStock,
			freeDelivery: form.freeDelivery,
			warrantyYears: Number.isFinite(warrantyYears) ? warrantyYears : 2,
			description: form.description.trim() || null,
			attributes: attrValues
		};
	}

	// "On sale" is automatic: a higher old price than the current price.
	const willBeOnSale = $derived(() => {
		const op = parseInt(String(form.oldPrice ?? ''), 10);
		const p = parseInt(String(form.price ?? ''), 10);
		return Number.isFinite(op) && Number.isFinite(p) && op > p;
	});

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		error = '';

		if (!form.name.trim()) {
			error = 'Məhsul adı tələb olunur.';
			return;
		}
		if (!form.categoryId || !form.collectionId) {
			error = 'Kateqoriya və kolleksiya seçin.';
			return;
		}

		const payload = buildPayload();
		if (!Number.isFinite(payload.price) || payload.price < 0) {
			error = 'Qiymət düzgün tam ədəd olmalıdır.';
			return;
		}

		submitting = true;
		try {
			if (isEdit && product) {
				await updateProduct(product.id, payload);
				await invalidateAll();
			} else {
				const created = await createProduct(payload);
				const id = created?.id;
				if (id == null) {
					goto('/admin/products');
					return;
				}
				// Upload the staged gallery, in order, right after creation.
				await uploadStagedImages(id);
				goto(`/admin/products/${id}/edit`);
			}
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			submitting = false;
			uploadProgress = { done: 0, total: 0 };
		}
	}

	/** @param {number | string} productId */
	async function uploadStagedImages(productId) {
		if (!stagedImages.length) return;
		uploadProgress = { done: 0, total: stagedImages.length };
		for (const item of stagedImages) {
			if (item.kind === 'file') {
				await uploadProductImage(productId, item.file);
			} else {
				await addProductImageUrl(productId, item.url);
			}
			uploadProgress = { ...uploadProgress, done: uploadProgress.done + 1 };
		}
	}
</script>

{#if error}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

<form class="adm-form" onsubmit={handleSubmit}>
	<div class="adm-form-grid">
		<div class="adm-form-field adm-form-span-2">
			<label for="name">Ad</label>
			<input id="name" type="text" required bind:value={form.name} />
		</div>

		<div class="adm-form-field">
			<label for="price">Qiymət (₼)</label>
			<input id="price" type="number" min="0" step="1" required bind:value={form.price} />
		</div>

		<div class="adm-form-field">
			<label for="oldPrice">Köhnə qiymət (endirim üçün)</label>
			<input id="oldPrice" type="number" min="0" step="1" placeholder="Boş = endirimsiz" bind:value={form.oldPrice} />
			<p class="adm-field-hint">
				{#if willBeOnSale()}
					<span class="adm-hint-sale">✓ Endirimli göstəriləcək</span>
				{:else}
					Cari qiymətdən yüksək köhnə qiymət yazsanız məhsul avtomatik “Endirim”də olacaq.
				{/if}
			</p>
		</div>

		<div class="adm-form-field">
			<label for="categoryId">Kateqoriya</label>
			<select id="categoryId" required bind:value={form.categoryId}>
				<option value="">Seçin…</option>
				{#each categories as cat}
					<option value={String(cat.id)}>{cat.name}</option>
				{/each}
			</select>
		</div>

		<div class="adm-form-field">
			<label for="collectionId">Kolleksiya</label>
			<select id="collectionId" required bind:value={form.collectionId}>
				<option value="">Seçin…</option>
				{#each collections as col}
					<option value={String(col.id)}>{col.name}</option>
				{/each}
			</select>
		</div>

		<div class="adm-form-field">
			<label for="warrantyYears">Zəmanət (il)</label>
			<input id="warrantyYears" type="number" min="0" step="1" bind:value={form.warrantyYears} />
		</div>

		<div class="adm-form-field adm-form-checks">
			<span class="adm-form-checks-label">Status</span>
			<label class="adm-check"><input type="checkbox" bind:checked={form.inStock} /> Stokda</label>
			<label class="adm-check"><input type="checkbox" bind:checked={form.isNew} /> Yeni</label>
			<label class="adm-check"><input type="checkbox" bind:checked={form.freeDelivery} /> Pulsuz çatdırılma</label>
		</div>

		<div class="adm-form-field adm-form-span-2">
			<label for="description">Təsvir</label>
			<textarea id="description" rows="4" bind:value={form.description}></textarea>
		</div>
	</div>

	<div class="adm-form-images">
		<ProductAttributeFields categoryId={form.categoryId} bind:values={attrValues} disabled={submitting} />
	</div>

	{#if !isEdit}
		<div class="adm-form-images">
			<ProductImageStager bind:items={stagedImages} disabled={submitting} />
		</div>
	{/if}

	<div class="adm-form-actions">
		<a href="/admin/products" class="adm-btn adm-btn-ghost">Ləğv et</a>
		<button type="submit" class="adm-btn adm-btn-primary" disabled={submitting}>
			{#if submitting && uploadProgress.total > 0}
				Şəkillər yüklənir… ({uploadProgress.done}/{uploadProgress.total})
			{:else if submitting}
				Saxlanılır…
			{:else if isEdit}
				Yenilə
			{:else}
				Məhsulu yarat
			{/if}
		</button>
	</div>
</form>

<style>
	.adm-form-images {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--adm-border);
	}
</style>
