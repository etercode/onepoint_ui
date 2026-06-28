<script>
	import { categories, categoryHref, collectionHref, collections } from '$lib/data/marketplace';

	let { open = $bindable(false) } = $props();

	let menuEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	function close() {
		open = false;
	}

	/** @param {MouseEvent} event */
	function handleWindowClick(event) {
		if (!open || !menuEl) return;
		if (!menuEl.contains(/** @type {Node} */ (event.target))) {
			close();
		}
	}

	/** @param {KeyboardEvent} event */
	function handleWindowKeydown(event) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div class="mp-catalog-menu" bind:this={menuEl}>
	<button
		type="button"
		class="mp-catalog-trigger"
		aria-expanded={open}
		aria-haspopup="true"
		aria-label="Kataloq menyusu"
		onclick={() => (open = !open)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
		</svg>
		<span>Kataloq</span>
		<svg class="mp-catalog-chevron" class:open xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
	</button>

	{#if open}
		<div class="mp-catalog-dropdown" role="menu">
			<a href="/catalog" class="mp-catalog-all" role="menuitem" onclick={close}>
				<strong>Bütün kataloq</strong>
				<span>Bütün məhsullara bax →</span>
			</a>

			<div class="mp-catalog-section">
				<p class="mp-catalog-section-title">Kateqoriyalar</p>
				<div class="mp-catalog-grid">
					{#each categories as cat}
						<a href={categoryHref(cat.name)} class="mp-catalog-item" role="menuitem" onclick={close}>
							<img src={cat.image} alt="" loading="lazy" />
							<span>{cat.name}</span>
						</a>
					{/each}
				</div>
			</div>

			<div class="mp-catalog-section">
				<p class="mp-catalog-section-title">Kolleksiyalar</p>
				<div class="mp-catalog-chips">
					{#each collections as col}
						<a href={collectionHref(col.name)} class="mp-catalog-chip" role="menuitem" onclick={close}>{col.name}</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
