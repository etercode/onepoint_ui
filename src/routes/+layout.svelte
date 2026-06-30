<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { auth } from '$lib/auth/auth.svelte';
	import { appearance } from '$lib/appearance/store.svelte';
	import { cart } from '$lib/cart/store.svelte';
	import { markInAppHistory } from '$lib/navigation/back';
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';

	let { children } = $props();

	afterNavigate(({ from }) => {
		if (from) markInAppHistory();
	});

	onMount(() => {
		appearance.init();
		auth.init();
		cart.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mirvari Mebel</title>
</svelte:head>

<NavigationProgress />
{@render children()}
