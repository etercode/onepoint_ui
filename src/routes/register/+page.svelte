<script>
	import { goto } from '$app/navigation';
	import { ApiClientError, register } from '$lib/api/client';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import UsernameField from '$lib/components/UsernameField.svelte';

	let usernameField = $state(/** @type {UsernameField | undefined} */ (undefined));

	let email = $state('');
	let password = $state('');
	let username = $state('');
	let name = $state('');
	let lastname = $state('');
	let timezone = $state('');
	let language = $state('');
	let birthday = $state('');
	let statusText = $state('');
	let description = $state('');
	let error = $state('');
	let submitting = $state(false);

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		error = '';

		if (usernameField && !(await usernameField.validate())) {
			error = 'Choose an available username';
			return;
		}

		submitting = true;

		try {
			await register({
				email,
				password,
				username,
				name,
				lastname,
				timezone: timezone.trim() || null,
				language: language.trim() || null,
				birthday: birthday || null,
				statusText: statusText || null,
				description: description || null
			});
			goto('/login');
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
	<title>Register — Mirvari Mebel</title>
</svelte:head>

<div class="auth-page">
	<div class="card" style="max-width: 480px;">
		<h1>Create account</h1>
		<p class="subtitle">Register for a new Mirvari Mebel account</p>

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
				<label for="password">Password <span class="optional">(min 8 characters)</span></label>
				<PasswordInput
					id="password"
					name="password"
					autocomplete="new-password"
					required
					minlength={8}
					bind:value={password}
				/>
			</div>

			<UsernameField bind:this={usernameField} id="username" bind:value={username} required />

			<div class="form-row">
				<div class="form-field">
					<label for="name">First name</label>
					<input id="name" type="text" name="name" required bind:value={name} />
				</div>
				<div class="form-field">
					<label for="lastname">Last name</label>
					<input id="lastname" type="text" name="lastname" required bind:value={lastname} />
				</div>
			</div>

			<div class="form-row">
				<div class="form-field">
					<label for="timezone">Timezone <span class="optional">(optional)</span></label>
					<input
						id="timezone"
						type="text"
						name="timezone"
						placeholder="Europe/Istanbul"
						maxlength="64"
						bind:value={timezone}
					/>
				</div>
				<div class="form-field">
					<label for="language">Language <span class="optional">(optional)</span></label>
					<input
						id="language"
						type="text"
						name="language"
						placeholder="en"
						maxlength="12"
						bind:value={language}
					/>
				</div>
			</div>

			<div class="form-field">
				<label for="birthday">Birthday <span class="optional">(optional)</span></label>
				<input id="birthday" type="date" name="birthday" bind:value={birthday} />
			</div>

			<div class="form-field">
				<label for="statusText">Status <span class="optional">(optional)</span></label>
				<input
					id="statusText"
					type="text"
					name="statusText"
					maxlength="255"
					placeholder="Hello there"
					bind:value={statusText}
				/>
			</div>

			<div class="form-field">
				<label for="description">Description <span class="optional">(optional)</span></label>
				<textarea id="description" name="description" bind:value={description}></textarea>
			</div>

			<button type="submit" class="btn" disabled={submitting}>
				{submitting ? 'Creating account…' : 'Create account'}
			</button>
		</form>

		<p class="form-footer">
			Already have an account? <a href="/login">Log in</a>
		</p>
	</div>
</div>
