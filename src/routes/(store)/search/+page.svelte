<script>
	import { page } from '$app/stores';
	import { searchProducts, popularSearches } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	const query = $derived($page.url.searchParams.get('q') ?? '');
	const results = $derived(searchProducts(query));
</script>

<svelte:head>
	<title>{query ? `"${query}" axtarışı` : 'Axtarış'} — onepoint</title>
</svelte:head>

<PageHero
	title={query ? `"${query}" üçün nəticələr` : 'Axtarış'}
	subtitle={query ? `${results.length} məhsul tapıldı` : 'Kataloqda məhsul axtarın'}
>
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Axtarış' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		<form class="mp-search mp-search-page" role="search" action="/search" method="get">
			<svg class="mp-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
			<input type="search" name="q" value={query} placeholder="Məhsul adı, kateqoriya…" aria-label="Axtarış" />
			<button type="submit" class="mp-search-btn">Axtar</button>
		</form>

		{#if !query}
			<div class="mp-section mp-section-compact" style="padding-left: 0; padding-right: 0;">
				<h2 class="mp-section-title-sm">Populyar axtarışlar</h2>
				<div class="mp-chips">
					{#each popularSearches as term}
						<a href="/search?q={encodeURIComponent(term)}" class="mp-chip">{term}</a>
					{/each}
				</div>
			</div>
		{:else if results.length > 0}
			<p class="mp-results-count">{results.length} məhsul</p>
			<div class="mp-product-grid">
				{#each results as product}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<div class="mp-empty-state">
				<h2>Nəticə tapılmadı</h2>
				<p>Başqa açar sözlərlə yenidən cəhd edin və ya kataloqa baxın.</p>
				<a href="/catalog" class="mp-btn-primary">Kataloqa bax</a>
			</div>
		{/if}
	</div>
</main>

<style>
	.mp-search-page {
		max-width: 36rem;
		margin-bottom: 2rem;
	}
</style>
