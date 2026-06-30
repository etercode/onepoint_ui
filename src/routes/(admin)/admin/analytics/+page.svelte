<script>
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import {
		formatPrice,
		getDashboardStats,
		mockOrders,
		allProducts
	} from '$lib/admin/data';

	const stats = getDashboardStats();
</script>

<svelte:head>
	<title>Analitika — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Analitika</h1>
		<p>Satış və kataloq göstəriciləri</p>
	</div>
</div>

<div class="adm-stats">
	<StatCard label="Ümumi gəlir" value={formatPrice(stats.revenue)} icon="₼" iconClass="adm-stat-icon-green" trend="+12%" />
	<StatCard label="Orta sifariş" value={formatPrice(Math.round(stats.revenue / mockOrders.length))} icon="📊" iconClass="adm-stat-icon-indigo" />
	<StatCard label="Məhsul sayı" value={stats.products} icon="🛋️" iconClass="adm-stat-icon-blue" />
	<StatCard label="Stokda bitən" value={stats.lowStock} icon="⚠️" iconClass="adm-stat-icon-amber" trendUp={false} />
</div>

<section class="adm-panel">
	<div class="adm-panel-head">
		<h2>Kateqoriya üzrə pay</h2>
	</div>
	<div class="adm-panel-body-pad">
		{#each ['Yumşaq mebel', 'Yataq mebeli', 'Qonaq otağı', 'Masa və stullar'] as catName}
			{@const count = allProducts.filter((p) => p.category === catName).length}
			{@const pct = Math.round((count / allProducts.length) * 100)}
			<div style="margin-bottom: 1rem;">
				<div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.375rem;">
					<span>{catName}</span>
					<strong>{pct}%</strong>
				</div>
				<div style="height: 8px; background: var(--adm-surface-2); border-radius: 999px; overflow: hidden;">
					<div style="height: 100%; width: {pct}%; background: linear-gradient(90deg, var(--adm-accent), #8b5cf6); border-radius: 999px;"></div>
				</div>
			</div>
		{/each}
	</div>
</section>
