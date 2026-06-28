<script>
	import { cart } from '$lib/cart/store.svelte';

	/** @type {{ productId: string, compact?: boolean }} */
	let { productId, compact = false } = $props();

	let added = $state(false);

	function handleClick(event) {
		event.preventDefault();
		event.stopPropagation();
		const ok = cart.add(productId);
		if (ok) {
			added = true;
			setTimeout(() => (added = false), 1500);
		}
	}
</script>

<button
	type="button"
	class="mp-add-cart-btn"
	class:mp-add-cart-btn-compact={compact}
	class:mp-btn-primary={!compact}
	class:mp-add-cart-btn-added={added}
	onclick={handleClick}
	aria-label={added ? 'Səbətə əlavə olundu' : 'Səbətə əlavə et'}
>
	{#if added}
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
		{#if !compact}<span>Əlavə olundu</span>{/if}
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
		</svg>
		{#if !compact}<span>Səbətə əlavə et</span>{/if}
	{/if}
</button>
