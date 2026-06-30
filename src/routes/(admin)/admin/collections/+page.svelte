<script>
	import { collections, allProducts } from '$lib/admin/data';
</script>

<svelte:head>
	<title>Kolleksiyalar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Kolleksiyalar</h1>
		<p>Məhsul kolleksiyalarının idarə edilməsi</p>
	</div>
	<button type="button" class="adm-btn adm-btn-primary">+ Kolleksiya</button>
</div>

<div class="adm-stats" style="grid-template-columns: repeat(3, 1fr);">
	{#each collections as col}
		<article class="adm-stat">
			<div class="adm-table-product" style="margin-bottom: 0.75rem;">
				<img src={col.image} alt="" style="width: 3rem; height: 3rem;" />
				<div>
					<strong style="font-size: 1rem;">{col.name}</strong>
					<span>{col.tagline}</span>
				</div>
			</div>
			<p class="adm-stat-value" style="font-size: 1.25rem;">{allProducts.filter((p) => p.collection === col.name).length}</p>
			<p class="adm-stat-label">kataloq məhsulu · {col.products} planlaşdırılan</p>
		</article>
	{/each}
</div>
