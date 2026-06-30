<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth/auth.svelte';
	import { appearance } from '$lib/appearance/store.svelte';
	import { cart } from '$lib/cart/store.svelte';

	let { children } = $props();

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

{@render children()}
