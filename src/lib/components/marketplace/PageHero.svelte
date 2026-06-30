<script>
	/** @type {{ title: string, subtitle?: string, eyebrow?: string, image?: string | null, children?: import('svelte').Snippet }} */
	let { title, subtitle = '', eyebrow = '', image = null, children } = $props();
</script>

<section class="mp-page-hero" class:mp-page-hero-has-image={Boolean(image)}>
	{#if image}
		<div class="mp-page-hero-cover" aria-hidden="true">
			<img src={image} alt="" loading="lazy" />
		</div>
	{/if}
	<div class="mp-container mp-page-hero-content">
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
