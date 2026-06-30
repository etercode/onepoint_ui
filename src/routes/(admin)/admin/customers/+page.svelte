<script>
	import { formatPrice, mockCustomers } from '$lib/admin/data';
</script>

<svelte:head>
	<title>Müştərilər — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Müştərilər</h1>
		<p>Qeydiyyatdan keçmiş alıcılar</p>
	</div>
</div>

<section class="adm-panel">
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Ad</th>
					<th>E-poçt</th>
					<th>Sifariş</th>
					<th>Xərclənib</th>
					<th>Qoşulub</th>
				</tr>
			</thead>
			<tbody>
				{#each mockCustomers as customer}
					<tr>
						<td><strong>{customer.name}</strong></td>
						<td>{customer.email}</td>
						<td>{customer.orders}</td>
						<td><strong>{formatPrice(customer.spent)}</strong></td>
						<td>{customer.joined}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
