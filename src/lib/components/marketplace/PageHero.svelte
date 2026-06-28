<script>
	/** @type {{ title: string, subtitle?: string, eyebrow?: string, children?: import('svelte').Snippet }} */
	let { title, subtitle = '', eyebrow = '', children } = $props();
</script>

<section class="mp-page-hero">
	<div class="mp-container">
		{#if children}
			{@render children()}
		{/if}
		{#if eyebrow}
			<p class="mp-page-eyebrow">{eyebrow}</p>
		{/if}
		<h1>{title}</h1>
		{#if subtitle}
			<p class="mp-page-lead">{subtitle}</p>
		{/if}
	</div>
</section>
