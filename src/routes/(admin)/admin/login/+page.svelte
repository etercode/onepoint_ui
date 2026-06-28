<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ApiClientError } from '$lib/api/client';
	import { auth } from '$lib/auth/auth.svelte';
	import { isAdminUser } from '$lib/admin/config';
	import PasswordInput from '$lib/components/PasswordInput.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let submitting = $state(false);

	onMount(async () => {
		await auth.init();
		if (auth.isAuthenticated && isAdminUser(auth.user)) {
			goto('/admin');
		}
	});

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		submitting = true;

		try {
			await auth.login(email, password);
			if (!isAdminUser(auth.user)) {
				await auth.logout();
				error = 'Bu hesabın admin girişi yoxdur.';
				return;
			}
			goto('/admin');
		} catch (err) {
			error = err instanceof ApiClientError ? err.message : 'Giriş alınmadı. Yenidən cəhd edin.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Admin girişi — onepoint</title>
</svelte:head>

<div class="adm-login-page">
	<div class="adm-login-brand">
		<div class="adm-sidebar-mark" style="margin-bottom: 2rem;">OP</div>
		<h1>İdarəetmə mərkəzi</h1>
		<p>
			onepoint mağazasının məhsullarını, sifarişlərini və müştəri müraciətlərini
			bir paneldən idarə edin.
		</p>
	</div>

	<div class="adm-login-form-wrap">
		<div class="adm-login-card">
			<h2>Admin girişi</h2>
			<p class="adm-login-sub">Yalnız səlahiyyətli işçilər üçün</p>

			{#if error}
				<div class="adm-alert adm-alert-error" role="alert">{error}</div>
			{/if}

			<form onsubmit={handleSubmit}>
				<div class="adm-form-field">
					<label for="email">E-poçt</label>
					<input id="email" type="email" autocomplete="email" required bind:value={email} />
				</div>
				<div class="adm-form-field">
					<label for="password">Şifrə</label>
					<PasswordInput id="password" name="password" autocomplete="current-password" required bind:value={password} />
				</div>
				<button type="submit" class="adm-btn adm-btn-primary" style="width: 100%;" disabled={submitting}>
					{submitting ? 'Daxil olunur…' : 'Daxil ol'}
				</button>
			</form>

			<p style="margin-top: 1.25rem; font-size: 0.8125rem; color: var(--adm-muted); text-align: center;">
				<a href="/" style="color: var(--adm-accent); text-decoration: none;">← Mağazaya qayıt</a>
			</p>
		</div>
	</div>
</div>
