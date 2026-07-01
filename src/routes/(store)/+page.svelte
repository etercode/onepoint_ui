<script>
	import {
		COMPANY,
		companyBenefits,
		categoryHref,
		collectionHref,
		popularSearches,
		roomInspirations
	} from '$lib/data/marketplace';
	import { resolveApiUrl } from '$lib/config';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{COMPANY.name} — {COMPANY.tagline}</title>
	<meta name="description" content="Mirvari Mebel — Azərbaycanda premium mebel. Divan, yataq, qonaq otağı və daha çoxu. Pulsuz çatdırılma, 2 il zəmanət." />
</svelte:head>

<section class="mp-hero">
	<div class="mp-hero-inner">
		<div class="mp-hero-copy">
			<p class="mp-hero-eyebrow">{COMPANY.since}-dan bəri · Azərbaycan mebel brendi</p>
			<h1>Evdə daha gözəldir</h1>
			<p class="mp-hero-lead">
				Rahatlıq və harmoniyanı öz evində birləşdir. Mirvari Mebel kolleksiyalarından divan, yataq,
				qonaq otağı və daha çoxunu kəşf et.
			</p>
			<div class="mp-hero-cta">
				<a href="/catalog" class="mp-hero-btn mp-hero-btn-primary">Kataloqa bax</a>
				<a href="/stores" class="mp-hero-btn mp-hero-btn-ghost">Mağazalarımız</a>
			</div>
			<div class="mp-trust-row">
				<span>✓ 2 il zəmanət</span>
				<span>✓ Pulsuz çatdırılma</span>
				<span>✓ 12 aya böl</span>
			</div>
		</div>
		<div class="mp-hero-visual" aria-label="Seçilmiş məhsullar">
			<div class="mp-hero-card mp-hero-card-1">
				<img src="https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png" alt="Lena divan" />
				<span>Lena divan · 817 ₼</span>
			</div>
			<div class="mp-hero-card mp-hero-card-2">
				<img src="https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png" alt="Yataq dəsti" />
				<span>Siena yataq dəsti · 1 164 ₼</span>
			</div>
			<div class="mp-hero-card mp-hero-card-3">
				<img src="https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png" alt="Stul" />
				<span>Cross stul · 59 ₼</span>
			</div>
		</div>
	</div>
</section>

<section class="mp-section mp-section-compact">
	<div class="mp-container">
		<h2 class="mp-section-title-sm">Populyar axtarışlar</h2>
		<div class="mp-chips">
			{#each popularSearches as term}
				<a href="/search?q={encodeURIComponent(term)}" class="mp-chip">{term}</a>
			{/each}
		</div>
	</div>
</section>

<section class="mp-section">
	<div class="mp-container">
		<div class="mp-section-head">
			<h2>Kateqoriyalar</h2>
			<a href="/catalog" class="mp-see-all">Bütün kataloq →</a>
		</div>
		<div class="mp-category-grid">
			{#each data.categories as cat}
				<a href={categoryHref(cat.slug)} class="mp-category-card">
					<div class="mp-category-img">
						<img src={resolveApiUrl(cat.image)} alt={cat.name} loading="lazy" />
					</div>
					<div class="mp-category-info">
						<h3>{cat.name}</h3>
						<p>
							{cat.productCount} məhsul
							{#if cat.priceFrom != null}
								· {cat.priceFrom} ₼-dan
							{/if}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="mp-section mp-section-alt" id="featured">
	<div class="mp-container">
		<div class="mp-section-head">
			<div>
				<h2>Seçilmiş məhsullar</h2>
				<p class="mp-section-desc">Ən çox sevilən Mirvari Mebel kolleksiyaları</p>
			</div>
			<a href="/catalog" class="mp-see-all">Hamısına bax →</a>
		</div>
		<div class="mp-product-grid">
			{#each data.featuredProducts as product}
				<ProductCard {product} featured />
			{/each}
		</div>
	</div>
</section>

<section class="mp-section">
	<div class="mp-container">
		<div class="mp-section-head">
			<div>
				<h2>Otaq ideyaları</h2>
				<p class="mp-section-desc">Mirvari Mebel ilə hazırlanmış interyer təklifləri</p>
			</div>
			<a href="/inspirations" class="mp-see-all">Daha çox →</a>
		</div>
		<div class="mp-inspire-grid">
			{#each roomInspirations as room, i}
				<a href="/inspirations" class="mp-inspire-card" class:mp-inspire-tall={i % 3 === 0}>
					<img src={room.image} alt={room.title} loading="lazy" />
					<div class="mp-inspire-overlay">
						<span class="mp-inspire-style">{room.style}</span>
						<h3>{room.title}</h3>
						<p>{room.items} məhsul</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="mp-section mp-section-compact">
	<div class="mp-container">
		<div class="mp-section-head">
			<h2>Kolleksiyalarımız</h2>
		</div>
		<div class="mp-brand-grid">
			{#each data.collections as col}
				<a href={collectionHref(col.slug)} class="mp-brand-card">
					<img class="mp-collection-thumb" src={resolveApiUrl(col.image)} alt={col.name} loading="lazy" />
					<div>
						<strong>{col.name}</strong>
						<p>{col.tagline}</p>
						<span>{col.productCount} məhsul</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="mp-section mp-section-compact">
	<div class="mp-container">
		<div class="mp-benefits-grid">
			{#each companyBenefits as benefit}
				<div class="mp-benefit-card">
					<span class="mp-benefit-icon" aria-hidden="true">{benefit.icon}</span>
					<strong>{benefit.title}</strong>
					<p>{benefit.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mp-section mp-section-alt">
	<div class="mp-container">
		<div class="mp-section-head">
			<div>
				<h2>Yeni gələnlər</h2>
				<p class="mp-section-desc">Kolleksiyaya yeni əlavə olunan məhsullar</p>
			</div>
		</div>
		<div class="mp-product-grid mp-product-grid-compact">
			{#each data.newestProducts as product}
				<ProductCard {product} />
			{/each}
		</div>
	</div>
</section>

<section class="mp-cta-banner">
	<div class="mp-container mp-cta-inner">
		<div>
			<h2>Peşəkar məsləhət lazımdır?</h2>
			<p>Dizaynerlərimiz sənin üçün ideal otaq həllini seçsin. Pulsuz konsultasiya.</p>
		</div>
		<a href="/consultation" class="mp-hero-btn mp-hero-btn-primary">Konsultasiya al</a>
	</div>
</section>
