<script>
	import { COMPANY } from '$lib/data/marketplace';
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
</script>

<svelte:head>
	<title>Haqqımızda — {COMPANY.name}</title>
</svelte:head>

<PageHero title="Haqqımızda" subtitle="{COMPANY.since}-dan bəri Azərbaycanda keyfiyyətli mebel istehsal edirik." eyebrow={COMPANY.name}>
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Haqqımızda' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		<div class="mp-prose">
			<h2>Biz kimik?</h2>
			<p>
				{COMPANY.name} — Azərbaycanda öz istehsalatı olan premium mebel brendidir. Divan, yataq dəstləri,
				qonaq otağı, uşaq otağı və ofis mebeli üzrə geniş kolleksiyalar təqdim edirik.
			</p>
			<p>
				Hər məhsul keyfiyyətə ciddi nəzarət altında hazırlanır. Müştərilərimizə yalnız mebel satmırıq —
				evlərində rahat və estetik məkan yaratmağa kömək edirik.
			</p>

			<h2>Niyə bizi seçməlisiniz?</h2>
			<p>
				Öz istehsalatımız sayəsində keyfiyyəti və qiyməti birbaşa idarə edirik. 2 il rəsmi zəmanət,
				Bakı daxilində pulsuz çatdırılma, peşəkar quraşdırma və 12 aya bölünmüş ödəniş imkanı təklif edirik.
			</p>
		</div>

		<div class="mp-content-grid" style="margin-top: 2.5rem;">
			<div class="mp-content-card">
				<h2>Missiyamız</h2>
				<p>Hər evə keyfiyyətli, əlçatan və müasir mebel gətirmək — rahatlıq və gözəlliyi birləşdirmək.</p>
			</div>
			<div class="mp-content-card">
				<h2>Vizyonumuz</h2>
				<p>Regionun ən etibarlı mebel brendi olmaq və müştəri məmnuniyyətini hər şeydən üstün tutmaq.</p>
			</div>
		</div>
	</div>
</main>
