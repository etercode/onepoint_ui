<script>
	import { page } from '$app/stores';
	import { goBack, goBackFrom } from '$lib/navigation/back';

	/** @type {{ fallback?: string, label?: string }} */
	let { fallback, label = 'Geri' } = $props();

	const pathname = $derived($page.url.pathname);

	function handleClick() {
		if (fallback) {
			goBack(fallback);
		} else {
			goBackFrom(pathname);
		}
	}
</script>

<button type="button" class="mp-back-btn" onclick={handleClick} aria-label={label}>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<polyline points="15 18 9 12 15 6"/>
	</svg>
</button>
