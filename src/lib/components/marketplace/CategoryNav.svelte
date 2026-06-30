<script>
	import { categoryHref } from '$lib/data/marketplace';

	/** @type {{
	 *   categories?: Array<Record<string, unknown>>,
	 *   activeSlug?: string | null,
	 *   mode?: 'rail' | 'sidebar' | 'both'
	 * }} */
	let { categories = [], activeSlug = null, mode = 'both' } = $props();

	const showRail = $derived(mode === 'rail' || mode === 'both');
	const showSidebar = $derived(mode === 'sidebar' || mode === 'both');
</script>

{#if showRail}
	<nav class="mp-category-rail mp-container" aria-label="Kateqoriyalar">
		<a href="/catalog" class="mp-category-rail-item" class:active={activeSlug === null}>Hamısı</a>
		{#each categories as cat}
			<a
				href={categoryHref(cat.slug)}
				class="mp-category-rail-item"
				class:active={cat.slug === activeSlug}
			>{cat.name}</a>
		{/each}
	</nav>
{/if}

{#if showSidebar}
	<aside class="mp-sidebar mp-sidebar-desktop" aria-label="Kateqoriyalar">
		<h3>Kateqoriyalar</h3>
		<nav class="mp-sidebar-nav">
			<a href="/catalog" class:active={activeSlug === null}>Hamısı</a>
			{#each categories as cat}
				<a href={categoryHref(cat.slug)} class:active={cat.slug === activeSlug}>{cat.name}</a>
			{/each}
		</nav>
	</aside>
{/if}
