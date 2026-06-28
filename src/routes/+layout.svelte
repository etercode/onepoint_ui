<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth/auth.svelte';

	let { children } = $props();

	onMount(() => {
		auth.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>onepoint</title>
</svelte:head>

{@render children()}
