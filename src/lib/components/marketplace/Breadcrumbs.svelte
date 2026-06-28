<script>
	/** @type {{ items: { label: string, href?: string }[] }} */
	let { items } = $props();
</script>

<nav class="mp-breadcrumbs" aria-label="Səhifə yolu">
	{#each items as item, i}
		{#if i > 0}
			<span class="mp-breadcrumb-sep" aria-hidden="true">/</span>
		{/if}
		{#if item.href}
			<a href={item.href}>{item.label}</a>
		{:else}
			<span class="mp-breadcrumb-current">{item.label}</span>
		{/if}
	{/each}
</nav>
