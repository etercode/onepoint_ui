<script>
	import { roomInspirations } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
</script>

<svelte:head>
	<title>Otaq ideyaları — Mirvari Mebel</title>
</svelte:head>

<PageHero title="Otaq ideyaları" subtitle="Mirvari Mebel məhsulları ilə hazırlanmış interyer təklifləri və ilhamlar.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Otaq ideyaları' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		<div class="mp-inspire-grid">
			{#each roomInspirations as room, i}
				<article class="mp-inspire-card" class:mp-inspire-tall={i % 3 === 0}>
					<img src={room.image} alt={room.title} loading="lazy" />
					<div class="mp-inspire-overlay">
						<span class="mp-inspire-style">{room.style}</span>
						<h3>{room.title}</h3>
						<p>{room.items} məhsul</p>
					</div>
				</article>
			{/each}
		</div>
		<div class="mp-cta-banner" style="margin-top: 2.5rem; border-radius: var(--mp-radius);">
			<div class="mp-container mp-cta-inner">
				<div>
					<h2>Öz eviniz üçün ideya lazımdır?</h2>
					<p>Dizaynerlərimiz pulsuz konsultasiya ilə kömək edəcək.</p>
				</div>
				<a href="/consultation" class="mp-hero-btn mp-hero-btn-primary">Konsultasiya al</a>
			</div>
		</div>
	</div>
</main>
