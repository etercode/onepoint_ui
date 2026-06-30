<script>
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import { formatPrice } from '$lib/admin/data';

	let { data } = $props();

	const stats = $derived(data.dashboard?.stats ?? {});
	const categories = $derived(data.categories ?? []);
	const totalProducts = $derived(
		categories.reduce((sum, cat) => sum + (/** @type {number} */ (cat.productCount) || 0), 0)
	);
	const avgOrder = $derived(
		stats.orders ? Math.round((stats.revenue ?? 0) / stats.orders) : 0
	);
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

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Analitika məlumatı yüklənmədi.</div>
{/if}

<div class="adm-stats">
	<StatCard label="Ümumi gəlir" value={formatPrice(stats.revenue ?? 0)} icon="₼" iconClass="adm-stat-icon-green" />
	<StatCard label="Orta sifariş" value={formatPrice(avgOrder)} icon="📊" iconClass="adm-stat-icon-indigo" />
	<StatCard label="Məhsul sayı" value={stats.products ?? 0} icon="🛋️" iconClass="adm-stat-icon-blue" />
	<StatCard label="Stokda bitən" value={stats.lowStock ?? 0} icon="⚠️" iconClass="adm-stat-icon-amber" trendUp={false} />
</div>

<section class="adm-panel">
	<div class="adm-panel-head">
		<h2>Kateqoriya üzrə pay</h2>
	</div>
	<div class="adm-panel-body-pad">
		{#each categories as cat}
			{@const count = cat.productCount ?? 0}
			{@const pct = totalProducts ? Math.round((count / totalProducts) * 100) : 0}
			<div style="margin-bottom: 1rem;">
				<div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.375rem;">
					<span>{cat.name}</span>
					<strong>{pct}% ({count})</strong>
				</div>
				<div style="height: 8px; background: var(--adm-surface-2); border-radius: 999px; overflow: hidden;">
					<div style="height: 100%; width: {pct}%; background: linear-gradient(90deg, var(--adm-accent), #8b5cf6); border-radius: 999px;"></div>
				</div>
			</div>
		{:else}
			<p class="adm-empty">Kateqoriya məlumatı yoxdur.</p>
		{/each}
	</div>
</section>
