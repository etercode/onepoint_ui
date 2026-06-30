<script>
	import ProductForm from '$lib/components/admin/ProductForm.svelte';
	import ProductImageGallery from '$lib/components/admin/ProductImageGallery.svelte';

	let { data } = $props();

	const productImages = $derived(
		Array.isArray(data.product?.images) ? data.product.images : []
	);
</script>

<svelte:head>
	<title>{data.product ? `${data.product.name} — redaktə` : 'Məhsul tapılmadı'} — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Məhsulu redaktə et</h1>
		<p>{data.product?.name ?? 'Məhsul tapılmadı'}</p>
	</div>
</div>

{#if data.product}
	<section class="adm-panel">
		<div class="adm-panel-body-pad">
			<ProductForm
				product={data.product}
				categories={data.categories}
				collections={data.collections}
			/>
		</div>
	</section>

	<section class="adm-panel" style="margin-top: 1rem;">
		<div class="adm-panel-body-pad">
			<ProductImageGallery productId={data.product.id} images={productImages} />
		</div>
	</section>
{:else}
	<div class="adm-empty">
		<p>Bu məhsul mövcud deyil.</p>
		<a href="/admin/products" class="adm-btn adm-btn-ghost">Məhsullara qayıt</a>
	</div>
{/if}
