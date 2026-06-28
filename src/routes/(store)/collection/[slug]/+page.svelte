<script>
	import { page } from '$app/stores';
	import {
		collectionHref,
		collections,
		getCollectionBySlug,
		getProductsByCollection,
		slugify
	} from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	const slug = $derived($page.params.slug);
	const collection = $derived(getCollectionBySlug(slug));
	const products = $derived(collection ? getProductsByCollection(collection.name) : []);
</script>

<svelte:head>
	<title>{collection ? `${collection.name} kolleksiyası — onepoint` : 'Kolleksiya tapılmadı'}</title>
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
		<div class="mp-container mp-inner-grid">
			<aside class="mp-sidebar">
				<h3>Kolleksiyalar</h3>
				<nav class="mp-sidebar-nav">
					{#each collections as col}
						<a href={collectionHref(col.name)} class:active={slugify(col.name) === slug}>{col.name}</a>
					{/each}
				</nav>
			</aside>

			<div>
				<p class="mp-results-count">{products.length} məhsul</p>
				{#if products.length > 0}
					<div class="mp-product-grid">
						{#each products as product}
							<ProductCard {product} />
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
