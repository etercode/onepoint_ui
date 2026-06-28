<script>
	import {
		allProducts
	} from '$lib/data/marketplace';
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

	const bounds = getPriceBounds(allProducts);
	const collectionOptions = getUniqueCollections(allProducts);

	let minPrice = $state(bounds.min);
	let maxPrice = $state(bounds.max);
	let category = $state('');
	let collection = $state('');
	let inStockOnly = $state(false);
	let onSaleOnly = $state(false);

	const filtered = $derived(
		filterProducts(allProducts, {
			minPrice,
			maxPrice,
			category,
			collection,
			inStockOnly,
			onSaleOnly
		})
	);

	function resetFilters() {
		const defaults = defaultFilters(bounds);
		minPrice = defaults.minPrice;
		maxPrice = defaults.maxPrice;
		category = defaults.category;
		collection = defaults.collection;
		inStockOnly = defaults.inStockOnly;
		onSaleOnly = defaults.onSaleOnly;
	}
</script>

<svelte:head>
	<title>Kataloq — onepoint</title>
</svelte:head>

<PageHero title="Kataloq" subtitle="Qiymət, kateqoriya və kolleksiyaya görə filtrləyin.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Kataloq' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container mp-inner-grid">
		<CatalogFilters
			bind:minPrice
			bind:maxPrice
			bind:category
			bind:collection
			bind:inStockOnly
			bind:onSaleOnly
			priceMin={bounds.min}
			priceMax={bounds.max}
			collections={collectionOptions}
			onreset={resetFilters}
		/>

		<div>
			<p class="mp-results-count">{filtered.length} məhsul tapıldı</p>
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
