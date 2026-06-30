<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { createProduct, updateProduct } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';

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
			onSale: Boolean(p?.onSale),
			isNew: Boolean(p?.isNew),
			inStock: p?.inStock !== false,
			freeDelivery: Boolean(p?.freeDelivery),
			warrantyYears: p?.warrantyYears != null ? String(p.warrantyYears) : '2',
			material: String(p?.material ?? ''),
			color: String(p?.color ?? ''),
			dimensions: String(p?.dimensions ?? ''),
			description: String(p?.description ?? '')
		};
	}

	let form = $state(toForm(null));
	let error = $state('');
	let submitting = $state(false);

	$effect(() => {
		form = toForm(product);
	});

	function buildPayload() {
		const price = parseInt(form.price, 10);
		const categoryId = parseInt(form.categoryId, 10);
		const collectionId = parseInt(form.collectionId, 10);
		const oldPriceRaw = form.oldPrice.trim();
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
			material: form.material.trim() || null,
			color: form.color.trim() || null,
			dimensions: form.dimensions.trim() || null,
			description: form.description.trim() || null
		};
	}

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
				if (id != null) {
					goto(`/admin/products/${id}/edit`);
				} else {
					goto('/admin/products');
				}
			}
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			submitting = false;
		}
	}
</script>

{#if error}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

{#if !isEdit}
	<div class="adm-alert adm-alert-warn" role="status">
		Şəkillər məhsul yaradıldıqdan sonra redaktə səhifəsində əlavə olunur.
	</div>
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
			<label for="oldPrice">Köhnə qiymət</label>
			<input id="oldPrice" type="number" min="0" step="1" bind:value={form.oldPrice} />
		</div>

		<div class="adm-form-field">
			<label for="categoryId">Kateqoriya</label>
			<select id="categoryId" required bind:value={form.categoryId}>
				<option value="">Seçin…</option>
				{#each categories as cat}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
		</div>

		<div class="adm-form-field">
			<label for="collectionId">Kolleksiya</label>
			<select id="collectionId" required bind:value={form.collectionId}>
				<option value="">Seçin…</option>
				{#each collections as col}
					<option value={col.id}>{col.name}</option>
				{/each}
			</select>
		</div>

		<div class="adm-form-field">
			<label for="material">Material</label>
			<input id="material" type="text" bind:value={form.material} />
		</div>

		<div class="adm-form-field">
			<label for="color">Rəng</label>
			<input id="color" type="text" bind:value={form.color} />
		</div>

		<div class="adm-form-field adm-form-span-2">
			<label for="dimensions">Ölçü</label>
			<input id="dimensions" type="text" bind:value={form.dimensions} />
		</div>

		<div class="adm-form-field">
			<label for="warrantyYears">Zəmanət (il)</label>
			<input id="warrantyYears" type="number" min="0" step="1" bind:value={form.warrantyYears} />
		</div>

		<div class="adm-form-field adm-form-checks">
			<span class="adm-form-checks-label">Status</span>
			<label class="adm-check"><input type="checkbox" bind:checked={form.inStock} /> Stokda</label>
			<label class="adm-check"><input type="checkbox" bind:checked={form.onSale} /> Endirim</label>
			<label class="adm-check"><input type="checkbox" bind:checked={form.isNew} /> Yeni</label>
			<label class="adm-check"><input type="checkbox" bind:checked={form.freeDelivery} /> Pulsuz çatdırılma</label>
		</div>

		<div class="adm-form-field adm-form-span-2">
			<label for="description">Təsvir</label>
			<textarea id="description" rows="4" bind:value={form.description}></textarea>
		</div>
	</div>

	<div class="adm-form-actions">
		<a href="/admin/products" class="adm-btn adm-btn-ghost">Ləğv et</a>
		<button type="submit" class="adm-btn adm-btn-primary" disabled={submitting}>
			{submitting ? 'Saxlanılır…' : isEdit ? 'Yenilə' : 'Yarat və şəkillər əlavə et'}
		</button>
	</div>
</form>
