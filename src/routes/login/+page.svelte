<script>
	import { goto } from '$app/navigation';
	import { ApiClientError } from '$lib/api/client';
	import { auth } from '$lib/auth/auth.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let submitting = $state(false);

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		submitting = true;

		try {
			await auth.login(email, password);
			goto('/dashboard');
		} catch (err) {
			if (err instanceof ApiClientError) {
				error = err.message;
			} else {
				error = 'Something went wrong. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Log in — onepoint</title>
</svelte:head>

<div class="auth-page">
	<div class="card">
		<h1>Log in</h1>
		<p class="subtitle">Sign in to your onepoint account</p>

		{#if error}
			<div class="alert alert-error" role="alert">{error}</div>
		{/if}

		<form onsubmit={handleSubmit}>
			<div class="form-field">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					name="email"
					autocomplete="email"
					required
					bind:value={email}
				/>
			</div>

			<div class="form-field">
				<label for="password">Password</label>
				<PasswordInput
					id="password"
					name="password"
					autocomplete="current-password"
					required
					bind:value={password}
				/>
			</div>

			<button type="submit" class="btn" disabled={submitting}>
				{submitting ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<p class="form-footer">
			Don't have an account? <a href="/register">Register</a>
		</p>
	</div>
</div>
