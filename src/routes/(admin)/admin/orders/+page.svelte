<script>
	import { formatPrice, mockOrders, orderStatuses } from '$lib/admin/data';
</script>

<svelte:head>
	<title>Sifarişlər — onepoint Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Sifarişlər</h1>
		<p>Bütün müştəri sifarişlərinin idarə edilməsi</p>
	</div>
</div>

<section class="adm-panel">
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Sifariş №</th>
					<th>Müştəri</th>
					<th>E-poçt</th>
					<th>Məhsul</th>
					<th>Məbləğ</th>
					<th>Tarix</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each mockOrders as order}
					<tr>
						<td><strong>{order.id}</strong></td>
						<td>{order.customer}</td>
						<td>{order.email}</td>
						<td>{order.items}</td>
						<td><strong>{formatPrice(order.total)}</strong></td>
						<td>{order.date}</td>
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
