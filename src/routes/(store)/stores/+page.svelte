<script>
	import { stores } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
</script>

<svelte:head>
	<title>Mağazalar — Mirvari Mebel</title>
</svelte:head>

<PageHero title="Mağazalarımız" subtitle="Məhsullarımızı yaxından görün, toxunun və peşəkar məsləhət alın.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Mağazalar' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		<div class="mp-store-grid">
			{#each stores as store}
				<article class="mp-store-card">
					<img src={store.image} alt={store.name} loading="lazy" />
					<div>
						<h3>{store.name}</h3>
						<p>{store.city}</p>
						<p>{store.address}</p>
						<p>{store.hours}</p>
						<a href="tel:{store.phone.replace(/\s/g, '')}">{store.phone}</a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</main>
