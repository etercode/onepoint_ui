<script>
	import { collectionHref } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	let { data } = $props();

	const collection = $derived(data.collection);
	const products = $derived(data.products);
</script>

<svelte:head>
	<title>{collection ? `${collection.name} kolleksiyası — Mirvari Mebel` : 'Kolleksiya tapılmadı'}</title>
</svelte:head>

{#if collection}
	<PageHero title="{collection.name} kolleksiyası" subtitle={collection.tagline} eyebrow="Kolleksiya">
		{#snippet children()}
			<Breadcrumbs
				items={[
					{ label: 'Ana səhifə', href: '/' },
					{ label: 'Kataloq', href: '/catalog' },
					{ label: collection.name }
				]}
			/>
		{/snippet}
	</PageHero>

	<main class="mp-inner-main">
		<div class="mp-container mp-inner-grid mp-collection-layout">
			<aside class="mp-sidebar mp-sidebar-desktop">
				<h3>Kolleksiyalar</h3>
				<nav class="mp-sidebar-nav">
					{#each data.collections as col}
						<a href={collectionHref(col.slug)} class:active={col.slug === collection.slug}>{col.name}</a>
					{/each}
				</nav>
			</aside>

			<div class="mp-category-main">
				<p class="mp-results-count">{products.length} məhsul</p>
				{#if products.length > 0}
					<div class="mp-product-grid">
						{#each products as product}
							<ProductCard {product} context="collection" />
						{/each}
					</div>
				{:else}
					<div class="mp-empty-state">
						<h2>Tezliklə</h2>
						<p>Bu kolleksiyaya yeni məhsullar əlavə olunur.</p>
						<a href="/catalog" class="mp-btn-primary">Bütün kataloq</a>
					</div>
				{/if}
			</div>
		</div>
	</main>
{:else}
	<PageHero title="Kolleksiya tapılmadı">
		{#snippet children()}
			<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Kataloq', href: '/catalog' }, { label: 'Tapılmadı' }]} />
		{/snippet}
	</PageHero>
	<main class="mp-inner-main">
		<div class="mp-container">
			<div class="mp-empty-state">
				<h2>Kolleksiya yoxdur</h2>
				<a href="/catalog" class="mp-btn-primary">Kataloqa bax</a>
			</div>
		</div>
	</main>
{/if}
