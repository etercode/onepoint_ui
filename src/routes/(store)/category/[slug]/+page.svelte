<script>
	import { categoryHref } from '$lib/data/marketplace';
	import {
		defaultFilters,
		filterProducts,
		getPriceBounds,
		getUniqueCollections
	} from '$lib/catalog/filters';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import CatalogFilters from '$lib/components/marketplace/CatalogFilters.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	let { data } = $props();

	const category = $derived(data.category);
	const baseProducts = $derived(data.products);
	const bounds = $derived(getPriceBounds(baseProducts));
	const collectionOptions = $derived(getUniqueCollections(baseProducts));

	let minPrice = $state(0);
	let maxPrice = $state(0);
	let collection = $state('');
	let inStockOnly = $state(false);
	let onSaleOnly = $state(false);

	$effect(() => {
		if (baseProducts.length > 0) {
			const b = getPriceBounds(baseProducts);
			minPrice = b.min;
			maxPrice = b.max;
		}
	});

	const filtered = $derived(
		filterProducts(baseProducts, {
			minPrice,
			maxPrice,
			category: category?.name ?? '',
			collection,
			inStockOnly,
			onSaleOnly
		})
	);

	function resetFilters() {
		const defaults = defaultFilters(bounds);
		minPrice = defaults.minPrice;
		maxPrice = defaults.maxPrice;
		collection = defaults.collection;
		inStockOnly = defaults.inStockOnly;
		onSaleOnly = defaults.onSaleOnly;
	}
</script>

<svelte:head>
	<title>{category ? `${category.name} — Mirvari Mebel` : 'Kateqoriya tapılmadı'}</title>
</svelte:head>

{#if category}
	<PageHero
		title={category.name}
		subtitle={`${category.productCount} məhsul${category.priceFrom != null ? ` · ${category.priceFrom} ₼-dan` : ''}`}
	>
		{#snippet children()}
			<Breadcrumbs
				items={[
					{ label: 'Ana səhifə', href: '/' },
					{ label: 'Kataloq', href: '/catalog' },
					{ label: category.name }
				]}
			/>
		{/snippet}
	</PageHero>

	<main class="mp-inner-main">
		<div class="mp-container mp-inner-grid">
			<div class="mp-filter-column">
				<aside class="mp-sidebar mp-sidebar-compact">
					<h3>Kateqoriyalar</h3>
					<nav class="mp-sidebar-nav">
						<a href="/catalog">Hamısı</a>
						{#each data.navCategories as cat}
							<a href={categoryHref(cat.slug)} class:active={cat.slug === category.slug}>{cat.name}</a>
						{/each}
					</nav>
				</aside>

				<CatalogFilters
					bind:minPrice
					bind:maxPrice
					bind:collection
					bind:inStockOnly
					bind:onSaleOnly
					lockCategory={category.name}
					priceMin={bounds.min}
					priceMax={bounds.max}
					collections={collectionOptions}
					onreset={resetFilters}
				/>
			</div>

			<div>
				<p class="mp-results-count">{filtered.length} məhsul</p>
				{#if filtered.length > 0}
					<div class="mp-product-grid">
						{#each filtered as product}
							<ProductCard {product} />
						{/each}
					</div>
				{:else}
					<div class="mp-empty-state">
						<h2>Məhsul tapılmadı</h2>
						<p>Filtrləri dəyişdirin.</p>
						<button type="button" class="mp-btn-primary" onclick={resetFilters}>Filtrləri sıfırla</button>
					</div>
				{/if}
			</div>
		</div>
	</main>
{:else}
	<PageHero title="Kateqoriya tapılmadı" subtitle="Bu kateqoriya mövcud deyil və ya silinib.">
		{#snippet children()}
			<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Kataloq', href: '/catalog' }, { label: 'Tapılmadı' }]} />
		{/snippet}
	</PageHero>
	<main class="mp-inner-main">
		<div class="mp-container">
			<div class="mp-empty-state">
				<h2>Kateqoriya yoxdur</h2>
				<p>Kataloqa qayıdın və başqa kateqoriya seçin.</p>
				<a href="/catalog" class="mp-btn-primary">Kataloqa bax</a>
			</div>
		</div>
	</main>
{/if}
