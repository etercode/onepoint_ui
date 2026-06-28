<script>
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
</script>

<svelte:head>
	<title>Çatdırılma — onepoint</title>
</svelte:head>

<PageHero title="Çatdırılma və quraşdırma" subtitle="Sifarişinizi evinizə çatdırır, peşəkar komandamızla quraşdırırıq.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Çatdırılma' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		<div class="mp-content-grid">
			<div class="mp-content-card">
				<h2>Bakı daxilində pulsuz</h2>
				<p>500 ₼ və üzəri sifarişlərdə Bakı şəhəri daxilində çatdırılma pulsuzdur. 1–3 iş günü ərzində çatdırılır.</p>
			</div>
			<div class="mp-content-card">
				<h2>Regionlara çatdırılma</h2>
				<p>Gəncə, Sumqayıt və digər şəhərlərə çatdırılma mövcuddur. Qiymət məsafəyə görə hesablanır.</p>
			</div>
			<div class="mp-content-card">
				<h2>Peşəkar quraşdırma</h2>
				<p>Divan, yataq dəstləri və böyük mebel üçün montaj xidməti təklif edirik. Quraşdırma vaxtı əvvəlcədən razılaşdırılır.</p>
			</div>
			<div class="mp-content-card">
				<h2>Zəmanət və qaytarma</h2>
				<p>Bütün məhsullara 2 il zəmanət verilir. Zədələnmiş məhsul çatdırıldıqda 48 saat ərzində bildirin.</p>
			</div>
		</div>

		<div class="mp-prose" style="margin-top: 2.5rem;">
			<h2>Çatdırılma prosesi</h2>
			<p>
				Sifariş təsdiqləndikdən sonra anbarımızdan hazırlanır və çatdırılma komandamız sizinlə əlaqə saxlayır.
				Çatdırılma günü və saatı əvvəlcədən razılaşdırılır. Böyük mebel üçün lift və giriş qapısı ölçülərini
				yoxlamağı tövsiyə edirik.
			</p>
		</div>
	</div>
</main>
