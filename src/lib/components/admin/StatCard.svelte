<script>
	/** @type {{ label: string, value: string | number, icon: string, iconClass?: string, trend?: string, trendUp?: boolean }} */
	let { label, value, icon, iconClass = 'adm-stat-icon-indigo', trend, trendUp = true } = $props();
</script>

<article class="adm-stat">
	<div class="adm-stat-top">
		<span class="adm-stat-icon {iconClass}" aria-hidden="true">{icon}</span>
		{#if trend}
			<span class="adm-stat-trend" class:adm-stat-trend-up={trendUp} class:adm-stat-trend-down={!trendUp}>{trend}</span>
		{/if}
	</div>
	<p class="adm-stat-value">{value}</p>
	<p class="adm-stat-label">{label}</p>
</article>
