<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	let show = $state(false);
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let delayTimer;

	onMount(() => {
		const unsubscribe = navigating.subscribe((nav) => {
			if (nav?.to) {
				delayTimer = setTimeout(() => {
					show = true;
				}, 120);
			} else {
				if (delayTimer) clearTimeout(delayTimer);
				show = false;
			}
		});

		return () => {
			unsubscribe();
			if (delayTimer) clearTimeout(delayTimer);
		};
	});
</script>

{#if show}
	<div class="nav-progress" role="progressbar" aria-label="Səhifə yüklənir" aria-busy="true">
		<div class="nav-progress-bar"></div>
	</div>
	<div class="nav-progress-overlay" aria-hidden="true"></div>
{/if}
