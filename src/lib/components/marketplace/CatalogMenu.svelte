<script>
	import { categoryHref, collectionHref, formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';

	/**
	 * @type {{
	 *   categories: Record<string, any>[],
	 *   collections: Record<string, any>[],
	 *   catalogMenu?: {
	 *     heading?: string, subheading?: string,
	 *     buttonLabel?: string, buttonHref?: string,
	 *     promos?: Array<{ id: number, name: string, image: string | null, price: number, href: string }>
	 *   } | null,
	 *   open?: boolean
	 * }}
	 */
	let { categories, collections, catalogMenu = null, open = $bindable(false) } = $props();

	let menuEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	const promos = $derived(catalogMenu?.promos ?? []);
	const heading = $derived(catalogMenu?.heading ?? 'Kataloq');
	const subheading = $derived(catalogMenu?.subheading ?? '');
	const buttonLabel = $derived(catalogMenu?.buttonLabel ?? 'Bütün kataloqa bax');
	const buttonHref = $derived(catalogMenu?.buttonHref ?? '/catalog');

	function close() {
		open = false;
	}

	/** @param {MouseEvent} event */
	function handleWindowClick(event) {
		if (!open || !menuEl) return;
		if (!menuEl.contains(/** @type {Node} */ (event.target))) close();
	}

	/** @param {KeyboardEvent} event */
	function handleWindowKeydown(event) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div class="mega" bind:this={menuEl}>
	<button
		type="button"
		class="mega-trigger"
		aria-expanded={open}
		aria-haspopup="true"
		aria-label="Kataloq menyusu"
		onclick={() => (open = !open)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
		</svg>
		<span class="mega-trigger-label">Kataloq</span>
		<svg class="mega-chevron" class:open xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
	</button>

	{#if open}
		<button type="button" class="mega-scrim" aria-label="Menyunu bağla" onclick={close}></button>
		<div class="mega-panel" role="menu">
			<div class="mega-cols">
				<div class="mega-lists">
					<a href="/catalog" class="mega-all" role="menuitem" onclick={close}>
						<strong>Bütün kataloq</strong>
						<span>Bütün məhsullara bax →</span>
					</a>

					<div class="mega-section">
						<p class="mega-section-title">Kateqoriyalar</p>
						<div class="mega-grid">
							{#each categories as cat}
								<a href={categoryHref(cat.slug)} class="mega-item" role="menuitem" onclick={close}>
									<span class="mega-item-thumb">
										{#if cat.image}<img src={resolveApiUrl(cat.image)} alt="" loading="lazy" />{/if}
									</span>
									<span class="mega-item-name">{cat.name}</span>
								</a>
							{/each}
						</div>
					</div>

					<div class="mega-section">
						<p class="mega-section-title">Kolleksiyalar</p>
						<div class="mega-chips">
							{#each collections as col}
								<a href={collectionHref(col.slug)} class="mega-chip" role="menuitem" onclick={close}>{col.name}</a>
							{/each}
						</div>
					</div>
				</div>

				<aside class="mega-promo">
					<div class="mega-promo-head">
						<p class="mega-promo-heading">{heading}</p>
						{#if subheading}<p class="mega-promo-sub">{subheading}</p>{/if}
					</div>
					<div class="mega-promo-list">
						{#each promos as promo (promo.id)}
							<a href={promo.href} class="mega-promo-card" onclick={close}>
								<span class="mega-promo-thumb">
									{#if promo.image}<img src={resolveApiUrl(promo.image)} alt="" loading="lazy" />{/if}
								</span>
								<span class="mega-promo-info">
									<span class="mega-promo-name">{promo.name}</span>
									<span class="mega-promo-price">{formatPrice(promo.price)}</span>
								</span>
							</a>
						{/each}
					</div>
					<a href={buttonHref} class="mega-promo-btn" onclick={close}>{buttonLabel}</a>
				</aside>
			</div>
		</div>
	{/if}
</div>

<style>
	.mega {
		position: relative;
	}

	.mega-trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		border: none;
		border-radius: var(--radius, 12px);
		background: var(--color-primary, #1d9bf0);
		color: #fff;
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		white-space: nowrap;
	}

	.mega-chevron {
		transition: transform 0.2s ease;
	}
	.mega-chevron.open {
		transform: rotate(180deg);
	}

	.mega-scrim {
		display: none;
		border: none;
	}

	.mega-panel {
		position: absolute;
		top: calc(100% + 0.6rem);
		left: 0;
		z-index: 60;
		width: min(60rem, calc(100vw - 2rem));
		max-height: min(80vh, 40rem);
		overflow: auto;
		background: var(--color-surface, #fff);
		border: 1px solid var(--color-border, #e4e6eb);
		border-radius: var(--radius-lg, 16px);
		box-shadow: var(--shadow-md, 0 8px 24px rgb(0 0 0 / 0.12));
		animation: mega-in 0.16s ease;
	}

	@keyframes mega-in {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.mega-cols {
		display: grid;
		grid-template-columns: 1fr 18rem;
	}

	.mega-lists {
		padding: 1.25rem;
	}

	.mega-all {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
		border-radius: var(--radius, 12px);
		background: color-mix(in srgb, var(--color-primary, #1d9bf0) 10%, transparent);
		color: var(--color-text, #111);
		text-decoration: none;
	}
	.mega-all strong { font-size: 0.95rem; }
	.mega-all span { font-size: 0.8rem; color: var(--color-muted, #666); }

	.mega-section + .mega-section {
		margin-top: 1.25rem;
	}

	.mega-section-title {
		margin: 0 0 0.625rem;
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-muted, #666);
	}

	.mega-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 0.5rem;
	}

	.mega-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.4rem 0.5rem;
		border-radius: 10px;
		text-decoration: none;
		color: var(--color-text, #111);
		transition: background 0.15s ease;
	}
	.mega-item:hover {
		background: var(--color-surface-2, #f2f3f5);
	}

	.mega-item-thumb {
		flex: 0 0 auto;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 8px;
		background: var(--color-surface-2, #f2f3f5);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mega-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
	.mega-item-name { font-size: 0.85rem; font-weight: 600; }

	.mega-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.mega-chip {
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		background: var(--color-surface-2, #f2f3f5);
		color: var(--color-text, #111);
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
	}
	.mega-chip:hover { background: color-mix(in srgb, var(--color-primary, #1d9bf0) 14%, transparent); }

	.mega-promo {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		background: var(--color-surface-2, #f7f8fa);
		border-left: 1px solid var(--color-border, #e4e6eb);
	}

	.mega-promo-heading {
		margin: 0;
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-text, #111);
	}
	.mega-promo-sub {
		margin: 0.125rem 0 0;
		font-size: 0.8rem;
		color: var(--color-muted, #666);
	}

	.mega-promo-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mega-promo-card {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.4rem;
		border-radius: 10px;
		text-decoration: none;
		color: var(--color-text, #111);
		background: var(--color-surface, #fff);
		border: 1px solid var(--color-border, #e4e6eb);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.mega-promo-card:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md, 0 8px 24px rgb(0 0 0 / 0.1));
	}

	.mega-promo-thumb {
		flex: 0 0 auto;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 8px;
		overflow: hidden;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mega-promo-thumb img { width: 100%; height: 100%; object-fit: contain; }

	.mega-promo-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
	.mega-promo-name {
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.mega-promo-price { font-size: 0.85rem; font-weight: 800; color: var(--color-primary, #1d9bf0); }

	.mega-promo-btn {
		margin-top: auto;
		text-align: center;
		padding: 0.65rem 1rem;
		border-radius: var(--radius, 12px);
		background: var(--color-primary, #1d9bf0);
		color: #fff;
		font-weight: 700;
		font-size: 0.85rem;
		text-decoration: none;
	}

	/* Tablet / mobile: full-screen sheet, single column */
	@media (max-width: 860px) {
		.mega-scrim {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 55;
			background: rgb(0 0 0 / 0.4);
		}
		.mega-panel {
			position: fixed;
			inset: auto 0 0 0;
			top: auto;
			width: 100%;
			max-height: 85vh;
			border-radius: var(--radius-lg, 16px) var(--radius-lg, 16px) 0 0;
		}
		.mega-cols {
			grid-template-columns: 1fr;
		}
		.mega-promo {
			border-left: none;
			border-top: 1px solid var(--color-border, #e4e6eb);
		}
	}
</style>
