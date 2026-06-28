<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth/auth.svelte';

	onMount(async () => {
		await auth.init();
		if (auth.isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<p class="subtitle" style="text-align: center; padding: 2rem;">Loading…</p>
