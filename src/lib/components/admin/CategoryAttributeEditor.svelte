<script>
	import {
		createCategoryAttribute,
		deleteCategoryAttribute,
		getCategoryAttributes,
		updateCategoryAttribute
	} from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';

	/** @type {{ categoryId: number | string, categoryName: string, onClose: () => void }} */
	let { categoryId, categoryName, onClose } = $props();

	const TYPES = [
		{ value: 'text', label: 'Mətn' },
		{ value: 'number', label: 'Rəqəm' },
		{ value: 'boolean', label: 'Bəli/Xeyr' },
		{ value: 'select', label: 'Siyahı' }
	];

	/** @type {Array<Record<string, any>>} */
	let attributes = $state([]);
	let loading = $state(true);
	let error = $state('');
	let saving = $state(false);
	let editing = $state(/** @type {Record<string, any> | null} */ (null));
	let showForm = $state(false);

	let form = $state(blankForm());

	function blankForm() {
		return {
			label: '',
			type: 'text',
			unit: '',
			options: '',
			required: false,
			filterable: false
		};
	}

	async function refresh() {
		loading = true;
		error = '';
		try {
			const res = await getCategoryAttributes(categoryId);
			attributes = res?.items ?? [];
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		categoryId; // re-run when category changes
		refresh();
	});

	function openCreate() {
		editing = null;
		form = blankForm();
		showForm = true;
		error = '';
	}

	/** @param {Record<string, any>} attr */
	function openEdit(attr) {
		editing = attr;
		form = {
			label: String(attr.label ?? ''),
			type: String(attr.type ?? 'text'),
			unit: String(attr.unit ?? ''),
			options: Array.isArray(attr.options) ? attr.options.join(', ') : '',
			required: Boolean(attr.required),
			filterable: Boolean(attr.filterable)
		};
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		editing = null;
	}

	function buildPayload() {
		const options =
			form.type === 'select'
				? form.options
						.split(',')
						.map((o) => o.trim())
						.filter(Boolean)
				: null;
		return {
			label: form.label.trim(),
			type: form.type,
			unit: form.unit.trim() || null,
			options,
			required: form.required,
			filterable: form.filterable
		};
	}

	async function handleSubmit() {
		error = '';
		if (!form.label.trim()) {
			error = 'Ad tələb olunur.';
			return;
		}
		if (form.type === 'select' && !form.options.split(',').some((o) => o.trim())) {
			error = 'Siyahı tipi üçün ən azı bir seçim daxil edin.';
			return;
		}

		saving = true;
		try {
			const payload = buildPayload();
			if (editing?.id != null) {
				await updateCategoryAttribute(categoryId, editing.id, payload);
			} else {
				await createCategoryAttribute(categoryId, payload);
			}
			closeForm();
			await refresh();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			saving = false;
		}
	}

	/** @param {Record<string, any>} attr */
	async function handleDelete(attr) {
		if (!confirm(`"${attr.label}" xüsusiyyətini silmək istəyirsiniz? Məhsul dəyərləri də silinəcək.`)) return;
		error = '';
		try {
			await deleteCategoryAttribute(categoryId, attr.id);
			await refresh();
		} catch (err) {
			error = formatAdminError(err);
		}
	}

	/** @param {string} type */
	function typeLabel(type) {
		return TYPES.find((t) => t.value === type)?.label ?? type;
	}
</script>

<section class="adm-panel adm-attr-editor">
	<div class="adm-panel-head">
		<h2>Xüsusiyyətlər — {categoryName}</h2>
		<div class="adm-attr-editor-head-actions">
			<button type="button" class="adm-btn adm-btn-primary" onclick={openCreate}>+ Xüsusiyyət</button>
			<button type="button" class="adm-btn adm-btn-ghost" onclick={onClose}>Bağla</button>
		</div>
	</div>

	<div class="adm-panel-body-pad">
		<p class="adm-gallery-hint">
			Bu kateqoriyanın məhsulları bu xüsusiyyətlərlə təsvir olunur. Sıra məhsul səhifəsində göstərilmə sırasıdır.
		</p>

		{#if error && !showForm}
			<div class="adm-alert adm-alert-error" role="alert">{error}</div>
		{/if}

		{#if showForm}
			<div class="adm-attr-form">
				{#if error}
					<div class="adm-alert adm-alert-error" role="alert">{error}</div>
				{/if}
				<div class="adm-form-grid">
					<div class="adm-form-field">
						<label for="attr-label">Ad</label>
						<input id="attr-label" type="text" bind:value={form.label} />
					</div>
					<div class="adm-form-field">
						<label for="attr-type">Tip</label>
						<select id="attr-type" bind:value={form.type}>
							{#each TYPES as t}
								<option value={t.value}>{t.label}</option>
							{/each}
						</select>
					</div>
					{#if form.type === 'number'}
						<div class="adm-form-field">
							<label for="attr-unit">Vahid (məs. sm, kq)</label>
							<input id="attr-unit" type="text" bind:value={form.unit} />
						</div>
					{/if}
					{#if form.type === 'select'}
						<div class="adm-form-field adm-form-span-2">
							<label for="attr-options">Seçimlər (vergüllə ayır)</label>
							<input id="attr-options" type="text" placeholder="Açılır, Sabit" bind:value={form.options} />
						</div>
					{/if}
					<div class="adm-form-field adm-form-checks">
						<span class="adm-form-checks-label">Parametrlər</span>
						<label class="adm-check"><input type="checkbox" bind:checked={form.required} /> Məcburi</label>
						<label class="adm-check"><input type="checkbox" bind:checked={form.filterable} /> Filtrlənə bilər</label>
					</div>
				</div>
				<div class="adm-form-actions">
					<button type="button" class="adm-btn adm-btn-ghost" onclick={closeForm}>Ləğv et</button>
					<button type="button" class="adm-btn adm-btn-primary" disabled={saving} onclick={handleSubmit}>
						{saving ? 'Saxlanılır…' : editing ? 'Yenilə' : 'Əlavə et'}
					</button>
				</div>
			</div>
		{/if}

		{#if loading}
			<p class="adm-empty">Yüklənir…</p>
		{:else if attributes.length === 0}
			<p class="adm-empty">Hələ xüsusiyyət yoxdur.</p>
		{:else}
			<div class="adm-table-wrap">
				<table class="adm-table">
					<thead>
						<tr>
							<th>Ad</th>
							<th>Tip</th>
							<th>Parametrlər</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each attributes as attr (attr.id)}
							<tr>
								<td>
									<strong>{attr.label}</strong>
									<span class="adm-attr-code">{attr.code}</span>
								</td>
								<td>
									{typeLabel(attr.type)}
									{#if attr.type === 'select' && attr.options?.length}
										<span class="adm-attr-code">{attr.options.join(' · ')}</span>
									{/if}
									{#if attr.unit}<span class="adm-attr-code">{attr.unit}</span>{/if}
								</td>
								<td>
									{#if attr.required}<span class="adm-pill adm-pill-warning">Məcburi</span>{/if}
									{#if attr.filterable}<span class="adm-pill adm-pill-info">Filtr</span>{/if}
								</td>
								<td class="adm-table-actions">
									<button type="button" class="adm-btn adm-btn-ghost" onclick={() => openEdit(attr)}>Redaktə</button>
									<button type="button" class="adm-btn adm-btn-ghost adm-btn-danger" onclick={() => handleDelete(attr)}>Sil</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>

<style>
	.adm-attr-editor {
		margin-bottom: 1rem;
		border: 2px solid var(--adm-accent);
	}

	.adm-attr-editor-head-actions {
		display: flex;
		gap: 0.5rem;
	}

	.adm-attr-form {
		padding: 1rem;
		margin-bottom: 1rem;
		border: 1px solid var(--adm-border);
		border-radius: var(--adm-radius-sm);
		background: var(--adm-surface-2);
	}

	.adm-attr-code {
		display: block;
		font-size: 0.6875rem;
		color: var(--adm-muted);
		margin-top: 0.125rem;
	}
</style>
