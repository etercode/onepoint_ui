<script>
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import { formatPrice, orderStatusPillClass, orderStatuses } from '$lib/admin/data';

	let { data } = $props();

	const dashboard = $derived(data.dashboard);
	const stats = $derived(dashboard?.stats ?? {});
	const recentOrders = $derived(dashboard?.recentOrders ?? []);
	const topProducts = $derived(dashboard?.topProducts ?? []);
</script>

<svelte:head>
	<title>İdarə paneli — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Xoş gəlmisiniz</h1>
		<p>Bu günün biznes göstəriciləri və son fəaliyyət</p>
	</div>
	<a href="/admin/products/new" class="adm-btn adm-btn-primary">+ Yeni məhsul</a>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Panel məlumatı yüklənmədi.</div>
{/if}

<div class="adm-stats">
	<StatCard label="Gəlir (ay)" value={formatPrice(stats.revenue ?? 0)} icon="₼" iconClass="adm-stat-icon-green" />
	<StatCard label="Sifarişlər" value={stats.orders ?? 0} icon="📦" iconClass="adm-stat-icon-indigo" />
	<StatCard label="Aktiv məhsul" value={stats.products ?? 0} icon="🛋️" iconClass="adm-stat-icon-blue" />
	<StatCard
		label="Yeni konsultasiya"
		value={stats.consultations ?? 0}
		icon="💬"
		iconClass="adm-stat-icon-amber"
		trend={(stats.consultations ?? 0) > 0 ? 'Yeni' : '0'}
		trendUp={(stats.consultations ?? 0) === 0}
	/>
</div>

<div class="adm-grid-2">
	<section class="adm-panel">
		<div class="adm-panel-head">
			<h2>Son sifarişlər</h2>
			<a href="/admin/orders">Hamısı →</a>
		</div>
		<div class="adm-table-wrap">
			<table class="adm-table">
				<thead>
					<tr>
						<th>Sifariş</th>
						<th>Müştəri</th>
						<th>Məbləğ</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each recentOrders as order}
						<tr>
							<td><strong>{order.orderNumber}</strong></td>
							<td>{order.customer}</td>
							<td>{formatPrice(order.total)}</td>
							<td>
								<span class="adm-pill adm-pill-{orderStatusPillClass(order.status)}">
									{orderStatuses[/** @type {keyof typeof orderStatuses} */ (order.status)]?.label ?? order.status}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="adm-empty">Sifariş yoxdur.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="adm-panel">
		<div class="adm-panel-head">
			<h2>Ən çox satılan</h2>
			<a href="/admin/products">Kataloq →</a>
		</div>
		<ul class="adm-activity">
			{#each topProducts as product}
				<li>
					<span class="adm-activity-dot" style="background: var(--adm-accent);"></span>
					<div>
						<strong>{product.name}</strong>
						<span>{product.sales} satış · {formatPrice(product.revenue)}</span>
					</div>
				</li>
			{:else}
				<li class="adm-empty">Məhsul yoxdur.</li>
			{/each}
		</ul>
	</section>
</div>
