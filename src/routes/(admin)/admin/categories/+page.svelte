<script>
	import { categories, allProducts, formatPrice } from '$lib/admin/data';
</script>

<svelte:head>
	<title>Kateqoriyalar — onepoint Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Kateqoriyalar</h1>
		<p>Mağaza kateqoriya strukturu</p>
	</div>
</div>

<section class="adm-panel">
	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Kateqoriya</th>
					<th>Kataloq məhsul</th>
					<th>Göstərilən say</th>
					<th>Min. qiymət</th>
				</tr>
			</thead>
			<tbody>
				{#each categories as cat}
					<tr>
						<td>
							<div class="adm-table-product">
								<img src={cat.image} alt="" />
								<div><strong>{cat.name}</strong></div>
							</div>
						</td>
						<td>{allProducts.filter((p) => p.category === cat.name).length}</td>
						<td>{cat.count}</td>
						<td>{formatPrice(cat.from)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
