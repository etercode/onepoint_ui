<script>
	import { getCategoryAttributes } from '$lib/api/client';

	/**
	 * Renders the inputs for the selected category's spec attributes and binds
	 * their values into `values` (keyed by attribute code). Fetches the category's
	 * attribute definitions whenever the category changes.
	 *
	 * @type {{
	 *   categoryId: number | string | '',
	 *   values: Record<string, unknown>,
	 *   disabled?: boolean
	 * }}
	 */
	let { categoryId, values = $bindable({}), disabled = false } = $props();

	/** @type {Array<Record<string, any>>} */
	let attributes = $state([]);
	let loading = $state(false);
	let loadError = $state('');
	let loadedFor = $state(/** @type {string} */ (''));

	$effect(() => {
		const id = categoryId ? String(categoryId) : '';
		if (id === loadedFor) return;
		loadedFor = id;
		attributes = [];
		loadError = '';
		if (!id) return;

		loading = true;
		getCategoryAttributes(id)
			.then((res) => {
				attributes = res?.items ?? [];
			})
			.catch(() => {
				loadError = 'Xüsusiyyətlər yüklənmədi.';
			})
			.finally(() => {
				loading = false;
			});
	});

	/** @param {string} code */
	function boolValue(code) {
		return values[code] === true || values[code] === '1' || values[code] === 'bəli';
	}
</script>

<div class="adm-attr-fields">
	<div class="adm-attr-head">
		<h3 class="adm-gallery-title">Xüsusiyyətlər</h3>
		{#if !categoryId}
			<p class="adm-gallery-hint">Xüsusiyyətləri görmək üçün kateqoriya seçin.</p>
		{:else if loading}
			<p class="adm-gallery-hint">Yüklənir…</p>
		{:else if attributes.length === 0}
			<p class="adm-gallery-hint">Bu kateqoriyanın xüsusiyyəti yoxdur. Kateqoriya səhifəsindən əlavə edin.</p>
		{/if}
	</div>

	{#if loadError}
		<div class="adm-alert adm-alert-warn" role="status">{loadError}</div>
	{/if}

	{#if attributes.length > 0}
		<div class="adm-form-grid">
			{#each attributes as attr (attr.id)}
				<div class="adm-form-field" class:adm-form-span-2={attr.type === 'text'}>
					<label for="attr-{attr.code}">
						{attr.label}{#if attr.unit}<span class="adm-attr-unit"> ({attr.unit})</span>{/if}
						{#if attr.required}<span class="adm-attr-req" aria-hidden="true">*</span>{/if}
					</label>

					{#if attr.type === 'boolean'}
						<label class="adm-check">
							<input
								type="checkbox"
								checked={boolValue(attr.code)}
								{disabled}
								onchange={(e) => (values[attr.code] = e.currentTarget.checked)}
							/>
							Bəli
						</label>
					{:else if attr.type === 'select'}
						<select id="attr-{attr.code}" bind:value={values[attr.code]} {disabled}>
							<option value="">Seçin…</option>
							{#each attr.options ?? [] as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					{:else if attr.type === 'number'}
						<input id="attr-{attr.code}" type="number" step="any" bind:value={values[attr.code]} {disabled} />
					{:else}
						<input id="attr-{attr.code}" type="text" bind:value={values[attr.code]} {disabled} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.adm-attr-head {
		margin-bottom: 0.5rem;
	}

	.adm-attr-unit {
		color: var(--adm-muted);
		font-weight: 400;
	}

	.adm-attr-req {
		color: var(--adm-danger);
		margin-left: 0.125rem;
	}
</style>
