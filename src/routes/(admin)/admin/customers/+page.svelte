<script>
	import { formatPrice } from '$lib/admin/data';

	let { data } = $props();

	const customers = $derived(data.customers ?? []);
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

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Müştəri siyahısı yüklənmədi.</div>
{/if}

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
				{#each customers as customer}
					<tr>
						<td><strong>{customer.name}</strong></td>
						<td>{customer.email}</td>
						<td>{customer.orders}</td>
						<td><strong>{formatPrice(customer.spent)}</strong></td>
						<td>{customer.joined}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="adm-empty">Müştəri yoxdur.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
