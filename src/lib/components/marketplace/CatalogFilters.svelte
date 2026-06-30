<script>
	import { formatPrice } from '$lib/data/marketplace';

	/**
	 * @type {{
	 *   minPrice: number,
	 *   maxPrice: number,
	 *   category: string,
	 *   collection: string,
	 *   inStockOnly: boolean,
	 *   onSaleOnly: boolean,
	 *   priceMin: number,
	 *   priceMax: number,
	 *   collections: string[],
	 *   categories?: Record<string, unknown>[],
	 *   lockCategory?: string,
	 *   onreset?: () => void
	 * }}
	 */
	let {
		minPrice = $bindable(0),
		maxPrice = $bindable(0),
		category = $bindable(''),
		collection = $bindable(''),
		inStockOnly = $bindable(false),
		onSaleOnly = $bindable(false),
		priceMin,
		priceMax,
		collections,
		categories = [],
		lockCategory = '',
		onreset = () => {}
	} = $props();

	const displayMin = $derived(minPrice);
	const displayMax = $derived(maxPrice);
</script>

<details class="mp-filters-wrap" open>
	<summary class="mp-filters-toggle">Filtrlər</summary>
	<aside class="mp-filters">
	<div class="mp-filters-head">
		<h3>Filtrlər</h3>
		<button type="button" class="mp-filters-reset" onclick={onreset}>Sıfırla</button>
	</div>

	<section class="mp-filter-block">
		<h4>Qiymət aralığı</h4>
		<div class="mp-price-range-labels">
			<span>{formatPrice(displayMin)}</span>
			<span>{formatPrice(displayMax)}</span>
		</div>
		<div class="mp-price-inputs">
			<label>
				Min
				<input type="number" min={priceMin} max={priceMax} bind:value={minPrice} />
			</label>
			<label>
				Max
				<input type="number" min={priceMin} max={priceMax} bind:value={maxPrice} />
			</label>
		</div>
		<input
			type="range"
			class="mp-range"
			min={priceMin}
			max={priceMax}
			bind:value={minPrice}
			aria-label="Minimum qiymət"
		/>
		<input
			type="range"
			class="mp-range"
			min={priceMin}
			max={priceMax}
			bind:value={maxPrice}
			aria-label="Maksimum qiymət"
		/>
	</section>

	{#if !lockCategory}
		<section class="mp-filter-block">
			<h4>Kateqoriya</h4>
			<div class="mp-filter-options">
				<label class="mp-filter-check">
					<input type="radio" name="category" value="" bind:group={category} />
					Hamısı
				</label>
				{#each categories as cat}
					<label class="mp-filter-check">
						<input type="radio" name="category" value={cat.name} bind:group={category} />
						{cat.name}
					</label>
				{/each}
			</div>
		</section>
	{/if}

	<section class="mp-filter-block">
		<h4>Kolleksiya</h4>
		<select class="mp-filter-select" bind:value={collection}>
			<option value="">Hamısı</option>
			{#each collections as name}
				<option value={name}>{name}</option>
			{/each}
		</select>
	</section>

	<section class="mp-filter-block">
		<h4>Digər</h4>
		<label class="mp-filter-check">
			<input type="checkbox" bind:checked={inStockOnly} />
			Yalnız stokda olanlar
		</label>
		<label class="mp-filter-check">
			<input type="checkbox" bind:checked={onSaleOnly} />
			Yalnız endirimli
		</label>
	</section>
	</aside>
</details>
