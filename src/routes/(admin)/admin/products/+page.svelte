<script>
	import { allProducts, formatPrice } from '$lib/admin/data';

	let query = $state('');

	const filtered = $derived(
		query.trim()
			? allProducts.filter((p) =>
					p.name.toLowerCase().includes(query.toLowerCase()) ||
					p.category.toLowerCase().includes(query.toLowerCase()) ||
					p.collection.toLowerCase().includes(query.toLowerCase())
				)
			: allProducts
	);
</script>

<svelte:head>
	<title>Məhsullar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Məhsullar</h1>
		<p>{allProducts.length} məhsul kataloqda</p>
	</div>
	<button type="button" class="adm-btn adm-btn-primary">+ Məhsul əlavə et</button>
</div>

<section class="adm-panel">
	<div class="adm-filters">
		<input
			type="search"
			class="adm-filter-input"
			placeholder="Ad, kateqoriya və ya kolleksiya…"
			bind:value={query}
		/>
	</div>
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Məhsul</th>
					<th>Kateqoriya</th>
					<th>Kolleksiya</th>
					<th>Qiymət</th>
					<th>Stok</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as product}
					<tr>
						<td>
							<div class="adm-table-product">
								<img src={product.image} alt="" />
								<div>
									<strong>{product.name}</strong>
									<span>{product.id}</span>
								</div>
							</div>
						</td>
						<td>{product.category}</td>
						<td>{product.collection}</td>
						<td><strong>{formatPrice(product.price)}</strong></td>
						<td>
							<span class="adm-pill adm-pill-{product.inStock ? 'success' : 'danger'}">
								{product.inStock ? 'Stokda' : 'Bitib'}
							</span>
						</td>
						<td>
							<a href="/product/{product.id}" class="adm-btn adm-btn-ghost" target="_blank" rel="noopener noreferrer">Bax</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
