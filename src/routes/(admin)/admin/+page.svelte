<script>
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import {
		formatPrice,
		getDashboardStats,
		getRecentOrders,
		getTopProducts,
		orderStatuses
	} from '$lib/admin/data';
	const stats = getDashboardStats();
	const orders = getRecentOrders();
	const topProducts = getTopProducts();
</script>

<svelte:head>
	<title>İdarə paneli — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Xoş gəlmisiniz</h1>
		<p>Bu günün biznes göstəriciləri və son fəaliyyət</p>
	</div>
	<a href="/admin/products" class="adm-btn adm-btn-primary">+ Yeni məhsul</a>
</div>

<div class="adm-stats">
	<StatCard label="Gəlir (ay)" value={formatPrice(stats.revenue)} icon="₼" iconClass="adm-stat-icon-green" trend="+12%" />
	<StatCard label="Sifarişlər" value={stats.orders} icon="📦" iconClass="adm-stat-icon-indigo" trend="+8%" />
	<StatCard label="Aktiv məhsul" value={stats.products} icon="🛋️" iconClass="adm-stat-icon-blue" />
	<StatCard label="Yeni konsultasiya" value={stats.consultations} icon="💬" iconClass="adm-stat-icon-amber" trend={stats.consultations > 0 ? 'Yeni' : '0'} trendUp={stats.consultations === 0} />
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
					{#each orders as order}
						<tr>
							<td><strong>{order.id}</strong></td>
							<td>{order.customer}</td>
							<td>{formatPrice(order.total)}</td>
							<td>
								<span class="adm-pill adm-pill-{orderStatuses[order.status].tone === 'success' ? 'success' : orderStatuses[order.status].tone === 'warning' ? 'warning' : orderStatuses[order.status].tone === 'danger' ? 'danger' : 'info'}">
									{orderStatuses[order.status].label}
								</span>
							</td>
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
			{#each topProducts as product, i}
				<li>
					<span class="adm-activity-dot" style="background: var(--adm-accent);"></span>
					<div>
						<strong>{product.name}</strong>
						<span>{product.sales} satış · {formatPrice(product.revenue)}</span>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</div>
