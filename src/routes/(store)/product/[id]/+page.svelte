<script>
	import {
		categoryHref,
		collectionHref,
		formatPrice
	} from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import AddToCartButton from '$lib/components/marketplace/AddToCartButton.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';
	import ProductGallery from '$lib/components/marketplace/ProductGallery.svelte';

	let { data } = $props();

	const product = $derived(data.product);
	const related = $derived(data.related);
</script>

<svelte:head>
	<title>{product ? `${product.name} — Mirvari Mebel` : 'Məhsul tapılmadı'}</title>
</svelte:head>

{#if product}
	<main class="mp-inner-main">
		<div class="mp-container">
			<Breadcrumbs
				items={[
					{ label: 'Ana səhifə', href: '/' },
					{ label: 'Kataloq', href: '/catalog' },
					{ label: product.category, href: categoryHref(product.categorySlug) },
					{ label: product.name }
				]}
			/>

			<div class="mp-product-detail">
				<ProductGallery {product} />

				<div class="mp-product-info">
					<p class="mp-page-eyebrow">{product.collection} kolleksiyası</p>
					<h1>{product.name}</h1>

					<div class="mp-price-row">
						<span class="mp-product-price">{formatPrice(product.price)}</span>
						{#if product.oldPrice}
							<span class="mp-product-old-price">{formatPrice(product.oldPrice)}</span>
						{/if}
					</div>

					<div class="mp-product-tags">
						{#if product.inStock}
							<span class="mp-tag mp-tag-stock">Stokda var</span>
						{/if}
						{#if product.onSale}
							<span class="mp-badge mp-badge-sale" style="position: static;">Endirim</span>
						{/if}
						{#if product.freeDelivery}
							<span class="mp-tag">Pulsuz çatdırılma</span>
						{/if}
						<span class="mp-tag">{product.warrantyYears} il zəmanət</span>
					</div>

					<dl class="mp-product-specs">
						<div>
							<dt>Kateqoriya</dt>
							<dd><a href={categoryHref(product.categorySlug)}>{product.category}</a></dd>
						</div>
						<div>
							<dt>Kolleksiya</dt>
							<dd><a href={collectionHref(product.collectionSlug)}>{product.collection}</a></dd>
						</div>
						<div>
							<dt>Material</dt>
							<dd>{product.material}</dd>
						</div>
						<div>
							<dt>Rəng</dt>
							<dd>{product.color}</dd>
						</div>
						<div>
							<dt>Ölçü</dt>
							<dd>{product.dimensions}</dd>
						</div>
					</dl>

					<p class="mp-product-desc">{product.description}</p>

					<div class="mp-product-actions">
						{#if product.inStock}
							<AddToCartButton {product} />
						{:else}
							<button type="button" class="mp-btn-secondary" disabled>Stokda yoxdur</button>
						{/if}
						<a href="/consultation" class="mp-btn-secondary">Konsultasiya al</a>
					</div>
				</div>
			</div>

			{#if related.length > 0}
				<section class="mp-section" style="padding-left: 0; padding-right: 0;">
					<div class="mp-section-head">
						<h2>Oxşar məhsullar</h2>
					</div>
					<div class="mp-product-grid mp-product-grid-compact">
						{#each related as item}
							<ProductCard product={item} />
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</main>
{:else}
	<section class="mp-page-hero">
		<div class="mp-container">
			<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Kataloq', href: '/catalog' }, { label: 'Tapılmadı' }]} />
			<h1>Məhsul tapılmadı</h1>
			<p class="mp-page-lead">Bu məhsul mövcud deyil və ya kataloqdan çıxarılıb.</p>
		</div>
	</section>
	<main class="mp-inner-main">
		<div class="mp-container">
			<div class="mp-empty-state">
				<a href="/catalog" class="mp-btn-primary">Kataloqa qayıt</a>
			</div>
		</div>
	</main>
{/if}

<style>
	.mp-product-info a {
		color: var(--mp-primary);
		text-decoration: none;
		font-weight: 600;
	}
</style>
