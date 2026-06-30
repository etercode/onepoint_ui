<script>
	import { formatPrice } from '$lib/data/marketplace';
	import AddToCartButton from '$lib/components/marketplace/AddToCartButton.svelte';

	/** @type {{ product: Record<string, unknown>, featured?: boolean }} */
	let { product, featured = false } = $props();
</script>

<article class="mp-product" class:mp-product-featured={featured}>
	<a href="/product/{product.id}" class="mp-product-link">
		<div class="mp-product-media">
			<img src={product.image} alt={product.name} loading="lazy" />
			{#if product.onSale}
				<span class="mp-badge mp-badge-sale">Endirim</span>
			{:else if product.isNew}
				<span class="mp-badge mp-badge-new">Yeni</span>
			{/if}
		</div>

		<div class="mp-product-body">
			<div class="mp-price-row">
				<span class="mp-product-price">{formatPrice(product.price)}</span>
				{#if product.oldPrice}
					<span class="mp-product-old-price">{formatPrice(product.oldPrice)}</span>
				{/if}
			</div>
			<h3 class="mp-product-title">{product.name}</h3>
			<p class="mp-product-meta">{product.category} · {product.collection} kolleksiyası</p>

			<div class="mp-product-tags">
				{#if product.inStock}
					<span class="mp-tag mp-tag-stock">Stokda var</span>
				{/if}
				{#if product.freeDelivery}
					<span class="mp-tag">Pulsuz çatdırılma</span>
				{/if}
				<span class="mp-tag">{product.warrantyYears} il zəmanət</span>
			</div>
		</div>
	</a>
	{#if product.inStock}
		<AddToCartButton {product} compact />
	{/if}
</article>
