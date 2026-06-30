<script>
	import ProductForm from '$lib/components/admin/ProductForm.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Yeni məhsul — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Yeni məhsul</h1>
		<p>Kataloqa yeni məhsul əlavə edin</p>
	</div>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Kateqoriya və kolleksiya siyahısı yüklənmədi.</div>
{/if}

<section class="adm-panel">
	<div class="adm-panel-body-pad">
		<ProductForm categories={data.categories} collections={data.collections} />
	</div>
</section>
