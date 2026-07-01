<script>
	/**
	 * Local image staging for the *create* flow (no product id yet). Collects
	 * files + URLs with previews, supports reorder/remove, and hands the ordered
	 * list back to the parent, which uploads them after the product is created.
	 *
	 * @typedef {{ kind: 'file', file: File, previewUrl: string } | { kind: 'url', url: string }} StagedImage
	 * @type {{ items: StagedImage[], disabled?: boolean }}
	 */
	let { items = $bindable([]), disabled = false } = $props();

	let imageUrl = $state('');
	let dragIndex = $state(/** @type {number | null} */ (null));

	/** @param {Event} event */
	function handleFiles(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const files = Array.from(input.files ?? []);
		input.value = '';
		if (!files.length) return;
		const staged = files.map((file) => ({
			kind: /** @type {const} */ ('file'),
			file,
			previewUrl: URL.createObjectURL(file)
		}));
		items = [...items, ...staged];
	}

	function addUrl() {
		const url = imageUrl.trim();
		if (!url) return;
		items = [...items, { kind: 'url', url }];
		imageUrl = '';
	}

	/** @param {number} index */
	function remove(index) {
		const item = items[index];
		if (item?.kind === 'file') URL.revokeObjectURL(item.previewUrl);
		items = items.filter((_, i) => i !== index);
	}

	/** @param {number} from @param {number} to */
	function move(from, to) {
		if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return;
		const next = [...items];
		const [it] = next.splice(from, 1);
		next.splice(to, 0, it);
		items = next;
	}

	/** @param {StagedImage} item */
	function src(item) {
		return item.kind === 'file' ? item.previewUrl : item.url;
	}

	/** @param {DragEvent} event @param {number} index */
	function onDragStart(event, index) {
		dragIndex = index;
		if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
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
		move(from, index);
	}
</script>

<div class="adm-gallery">
	<h3 class="adm-gallery-title">Şəkil qalereyası</h3>
	<p class="adm-gallery-hint">Sürükləyərək sıranı dəyişin. Birinci şəkil əsas şəkildir.</p>

	{#if items.length > 0}
		<div class="adm-gallery-grid" role="list">
			{#each items as item, i (item.kind === 'file' ? item.previewUrl : item.url + i)}
				<div
					class="adm-gallery-item"
					class:adm-gallery-item-primary={i === 0}
					role="listitem"
					draggable={!disabled}
					ondragstart={(e) => onDragStart(e, i)}
					ondragover={onDragOver}
					ondrop={(e) => onDrop(e, i)}
				>
					<img src={src(item)} alt="" />
					{#if i === 0}
						<span class="adm-gallery-badge">Əsas</span>
					{/if}
					<button
						type="button"
						class="adm-gallery-delete"
						disabled={disabled}
						aria-label="Şəkli sil"
						onclick={() => remove(i)}
					>×</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="adm-empty">Hələ şəkil əlavə edilməyib.</p>
	{/if}

	<div class="adm-gallery-add">
		<div class="adm-form-field">
			<label for="stage-url">URL ilə əlavə et</label>
			<div class="adm-gallery-url-row">
				<input
					id="stage-url"
					type="url"
					placeholder="https://…"
					bind:value={imageUrl}
					disabled={disabled}
					onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
				/>
				<button type="button" class="adm-btn adm-btn-ghost" disabled={disabled || !imageUrl.trim()} onclick={addUrl}>
					Əlavə et
				</button>
			</div>
		</div>
		<div class="adm-form-field">
			<label for="stage-file">Fayl yüklə</label>
			<input id="stage-file" type="file" accept="image/*" multiple disabled={disabled} onchange={handleFiles} />
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
