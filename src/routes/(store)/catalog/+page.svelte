<script>
	import {
		defaultFilters,
		filterProducts,
		getPriceBounds,
		getUniqueCollections
	} from '$lib/catalog/filters';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import CatalogFilters from '$lib/components/marketplace/CatalogFilters.svelte';
	import CategoryNav from '$lib/components/marketplace/CategoryNav.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	let { data } = $props();

	const allProducts = $derived(data.products);
	const bounds = $derived(getPriceBounds(allProducts));
	const collectionOptions = $derived(getUniqueCollections(allProducts));

	let minPrice = $state(0);
	let maxPrice = $state(0);
	let collection = $state('');
	let inStockOnly = $state(false);
	let onSaleOnly = $state(false);
	let filtersOpen = $state(false);

	$effect(() => {
		const b = bounds;
		if (allProducts.length > 0) {
			minPrice = b.min;
			maxPrice = b.max;
		}
	});

	const filtered = $derived(
		filterProducts(allProducts, {
			minPrice,
			maxPrice,
			category: '',
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

	function openFilters() {
		filtersOpen = true;
		document.getElementById('catalog-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Kataloq — Mirvari Mebel</title>
</svelte:head>

<PageHero title="Kataloq" subtitle="Qiymət, kateqoriya və kolleksiyaya görə filtrləyin.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Kataloq' }]} />
	{/snippet}
</PageHero>

<CategoryNav categories={data.navCategories} activeSlug={null} mode="rail" />

<main class="mp-inner-main">
	<div class="mp-container mp-inner-grid mp-category-layout">
		<div class="mp-filter-column">
			<CategoryNav categories={data.navCategories} activeSlug={null} mode="sidebar" />

			<CatalogFilters
				bind:minPrice
				bind:maxPrice
				bind:collection
				bind:inStockOnly
				bind:onSaleOnly
				bind:filtersOpen
				lockCategory="all"
				priceMin={bounds.min}
				priceMax={bounds.max}
				collections={collectionOptions}
				onreset={resetFilters}
			/>
		</div>

		<div class="mp-category-main">
			<div class="mp-list-toolbar">
				<p class="mp-results-count">{filtered.length} məhsul tapıldı</p>
				<button type="button" class="mp-filter-toggle-btn" onclick={openFilters}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
					Filtrlər
				</button>
			</div>

			{#if filtered.length > 0}
				<div class="mp-product-grid">
					{#each filtered as product}
						<ProductCard {product} />
					{/each}
				</div>
			{:else}
				<div class="mp-empty-state">
					<h2>Məhsul tapılmadı</h2>
					<p>Filtrləri dəyişdirin və ya sıfırlayın.</p>
					<button type="button" class="mp-btn-primary" onclick={resetFilters}>Filtrləri sıfırla</button>
				</div>
			{/if}
		</div>
	</div>
</main>
