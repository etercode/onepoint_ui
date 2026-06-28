<script>
	import { auth } from '$lib/auth/auth.svelte';
</script>

<svelte:head>
	<title>Dashboard — onepoint</title>
</svelte:head>

<div class="empty-state">
	<h2>Dashboard</h2>
	{#if auth.user}
		<p>Welcome, {auth.user.name} {auth.user.lastname}.</p>
	{/if}
	<p>Your workspace is ready. Content will appear here.</p>
</div>
