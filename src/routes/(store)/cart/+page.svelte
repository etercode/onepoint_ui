<script>
	import { cart } from '$lib/cart/store.svelte';
	import { formatPrice } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
</script>

<svelte:head>
	<title>Səbət — onepoint</title>
</svelte:head>

<PageHero title="Səbət" subtitle={cart.count > 0 ? `${cart.count} məhsul seçilib` : 'Səbətiniz boşdur'}>
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Səbət' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		{#if cart.lines.length > 0}
			<div class="mp-cart-layout">
				<div class="mp-cart-lines">
					{#each cart.lines as line (line.productId)}
						<article class="mp-cart-line">
							<a href="/product/{line.product.id}" class="mp-cart-line-img">
								<img src={line.product.image} alt={line.product.name} />
							</a>
							<div class="mp-cart-line-body">
								<a href="/product/{line.product.id}" class="mp-cart-line-title">{line.product.name}</a>
								<p class="mp-cart-line-meta">{line.product.category}</p>
								<p class="mp-cart-line-price">{formatPrice(line.product.price)}</p>
							</div>
							<div class="mp-cart-line-qty">
								<button
									type="button"
									class="mp-qty-btn"
									aria-label="Azalt"
									onclick={() => cart.setQuantity(line.productId, line.quantity - 1)}
								>−</button>
								<span>{line.quantity}</span>
								<button
									type="button"
									class="mp-qty-btn"
									aria-label="Artır"
									onclick={() => cart.setQuantity(line.productId, line.quantity + 1)}
								>+</button>
							</div>
							<div class="mp-cart-line-total">{formatPrice(line.lineTotal)}</div>
							<button
								type="button"
								class="mp-cart-remove"
								aria-label="Sil"
								onclick={() => cart.remove(line.productId)}
							>×</button>
						</article>
					{/each}
				</div>

				<aside class="mp-cart-summary">
					<h2>Sifariş xülasəsi</h2>
					<div class="mp-cart-summary-row">
						<span>Ara cəm</span>
						<strong>{formatPrice(cart.subtotal)}</strong>
					</div>
					<div class="mp-cart-summary-row">
						<span>Çatdırılma</span>
						<strong class="mp-cart-free">Pulsuz</strong>
					</div>
					<div class="mp-cart-summary-row mp-cart-summary-total">
						<span>Cəmi</span>
						<strong>{formatPrice(cart.subtotal)}</strong>
					</div>
					<button type="button" class="mp-btn-primary mp-cart-checkout">Sifarişi rəsmiləşdir</button>
					<a href="/catalog" class="mp-btn-secondary mp-cart-continue">Alış-verişə davam et</a>
				</aside>
			</div>
		{:else}
			<div class="mp-empty-state">
				<h2>Səbətiniz boşdur</h2>
				<p>Kataloqdan məhsul seçib səbətə əlavə edin.</p>
				<a href="/catalog" class="mp-btn-primary">Kataloqa bax</a>
			</div>
		{/if}
	</div>
</main>
