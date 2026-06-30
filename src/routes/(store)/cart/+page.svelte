<script>
	import { getProducts } from '$lib/api/client';
	import { cart } from '$lib/cart/store.svelte';
	import { formatPrice } from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';

	/** @type {Record<string, unknown>[]} */
	let products = $state([]);
	let hydrating = $state(false);

	$effect(() => {
		if (!cart.ready) return;

		const ids = cart.items.map((line) => line.productId);
		if (ids.length === 0) {
			products = [];
			hydrating = false;
			return;
		}

		hydrating = true;
		getProducts({ ids: ids.join(',') })
			.then((res) => {
				products = res.items;
			})
			.catch(() => {
				products = [];
			})
			.finally(() => {
				hydrating = false;
			});
	});

	const lines = $derived(
		cart.items
			.map((line) => {
				const product = products.find((p) => p.id === line.productId);
				if (!product) return null;
				return { ...line, product, lineTotal: product.price * line.quantity };
			})
			.filter(Boolean)
	);

	const subtotal = $derived(lines.reduce((sum, line) => sum + line.lineTotal, 0));
</script>

<svelte:head>
	<title>Səbət — Mirvari Mebel</title>
</svelte:head>

<PageHero title="Səbət" subtitle={cart.count > 0 ? `${cart.count} məhsul seçilib` : 'Səbətiniz boşdur'}>
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Səbət' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		{#if hydrating && cart.count > 0}
			<p class="mp-results-count">Səbət yüklənir…</p>
		{:else if lines.length > 0}
			<div class="mp-cart-layout">
				<div class="mp-cart-lines">
					{#each lines as line (line.productId)}
						<article class="mp-cart-line">
							<a href="/product/{line.product.id}" class="mp-cart-line-img">
								<img src={resolveApiUrl(line.product.image)} alt={line.product.name} />
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
						<strong>{formatPrice(subtotal)}</strong>
					</div>
					<div class="mp-cart-summary-row">
						<span>Çatdırılma</span>
						<strong class="mp-cart-free">Pulsuz</strong>
					</div>
					<div class="mp-cart-summary-row mp-cart-summary-total">
						<span>Cəmi</span>
						<strong>{formatPrice(subtotal)}</strong>
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
