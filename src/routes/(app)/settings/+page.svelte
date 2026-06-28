<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ApiClientError, changePassword, updateProfile } from '$lib/api/client';
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';
	import AppearancePanel from '$lib/components/AppearancePanel.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import ProfilePhotoEditor from '$lib/components/ProfilePhotoEditor.svelte';
	import UsernameField from '$lib/components/UsernameField.svelte';

	/** @type {'account' | 'password' | 'appearance'} */
	let tab = $state('account');

	let usernameField = $state(/** @type {UsernameField | undefined} */ (undefined));

	let username = $state('');
	let name = $state('');
	let lastname = $state('');
	let timezone = $state('');
	let language = $state('');
	let birthday = $state('');
	let statusText = $state('');
	let description = $state('');

	let profileError = $state('');
	let profileSuccess = $state('');
	let profileSubmitting = $state(false);
	let photoPreview = $state(/** @type {string | null} */ (null));
	let photoMessage = $state('');
	let photoMessageType = $state(/** @type {'success' | 'error'} */ ('success'));

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let passwordSuccess = $state('');
	let passwordSubmitting = $state(false);

	const originalUsername = $derived(auth.user?.username ?? '');

	const tabs = [
		{ id: 'account', label: 'Account' },
		{ id: 'password', label: 'Password' },
		{ id: 'appearance', label: 'Appearance' }
	];

	onMount(() => {
		const hash = $page.url.hash.replace('#', '');
		if (hash === 'password' || hash === 'appearance') tab = hash;
		fillFromUser();
	});

	$effect(() => {
		if (auth.user) fillFromUser();
	});

	function fillFromUser() {
		const user = auth.user;
		if (!user) return;
		username = user.username ?? '';
		name = user.name ?? '';
		lastname = user.lastname ?? '';
		timezone = user.timezone ?? '';
		language = user.language ?? '';
		birthday = user.birthday ?? '';
		statusText = user.statusText ?? '';
		description = user.description ?? '';
		photoPreview = resolveApiUrl(user.profilePhotoUrl);
	}

	/** @param {'account' | 'password' | 'appearance'} id */
	function selectTab(id) {
		tab = id;
	}

	/** @param {SubmitEvent} event */
	async function handleProfileSubmit(event) {
		event.preventDefault();
		profileError = '';
		profileSuccess = '';

		if (usernameField && !(await usernameField.validate())) {
			profileError = 'Choose an available username';
			return;
		}

		profileSubmitting = true;
		try {
			const user = await updateProfile({
				username: username.trim(),
				name: name.trim(),
				lastname: lastname.trim(),
				timezone: timezone.trim() || null,
				language: language.trim() || null,
				birthday: birthday || null,
				statusText: statusText.trim() || null,
				description: description.trim() || null
			});
			auth.user = user;
			profileSuccess = 'Profile updated';
		} catch (err) {
			profileError = err instanceof ApiClientError ? err.message : 'Update failed';
		} finally {
			profileSubmitting = false;
		}
	}

	/** @param {SubmitEvent} event */
	async function handlePasswordSubmit(event) {
		event.preventDefault();
		passwordError = '';
		passwordSuccess = '';

		if (newPassword !== confirmPassword) {
			passwordError = 'New passwords do not match';
			return;
		}

		passwordSubmitting = true;
		try {
			await changePassword({ currentPassword, newPassword });
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			passwordSuccess = 'Password changed';
		} catch (err) {
			passwordError = err instanceof ApiClientError ? err.message : 'Password change failed';
		} finally {
			passwordSubmitting = false;
		}
	}

	/** @param {string} message */
	function onPhotoSuccess(message) {
		photoMessage = message;
		photoMessageType = 'success';
	}

	/** @param {string} message */
	function onPhotoError(message) {
		photoMessage = message;
		photoMessageType = 'error';
	}
</script>

<svelte:head>
	<title>Settings — onepoint</title>
</svelte:head>

<div class="settings-page">
	<h1 class="page-title">Settings</h1>

	<div class="settings-layout">
		<nav class="settings-nav" aria-label="Settings sections">
			{#each tabs as item}
				<button
					type="button"
					class="settings-nav-item"
					class:settings-nav-item-active={tab === item.id}
					onclick={() => selectTab(/** @type {'account' | 'password' | 'appearance'} */ (item.id))}
				>
					{item.label}
				</button>
			{/each}
		</nav>

		<div class="settings-content">
			{#if tab === 'account'}
				<section class="panel panel-flat">
					<h2>Profile photo</h2>
					{#if photoMessage}
						<div
							class="alert"
							class:alert-error={photoMessageType === 'error'}
							class:alert-success={photoMessageType === 'success'}
							role="status"
						>
							{photoMessage}
						</div>
					{/if}
					<ProfilePhotoEditor
						bind:preview={photoPreview}
						onSuccess={onPhotoSuccess}
						onError={onPhotoError}
					/>
				</section>

				<section class="panel panel-flat">
					<h2>Profile information</h2>
					<p class="panel-desc">Email cannot be changed here.</p>

					{#if profileError}
						<div class="alert alert-error" role="alert">{profileError}</div>
					{/if}
					{#if profileSuccess}
						<div class="alert alert-success" role="status">{profileSuccess}</div>
					{/if}

					<form onsubmit={handleProfileSubmit}>
						{#if auth.user}
							<div class="form-field">
								<label for="email">Email</label>
								<input id="email" type="email" value={auth.user.email} disabled />
							</div>
						{/if}

						<UsernameField
							bind:this={usernameField}
							id="username"
							bind:value={username}
							{originalUsername}
							required
						/>

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
								<input id="timezone" type="text" name="timezone" placeholder="Europe/Istanbul" maxlength="64" bind:value={timezone} />
							</div>
							<div class="form-field">
								<label for="language">Language <span class="optional">(optional)</span></label>
								<input id="language" type="text" name="language" placeholder="en" maxlength="12" bind:value={language} />
							</div>
						</div>

						<div class="form-field">
							<label for="birthday">Birthday <span class="optional">(optional)</span></label>
							<input id="birthday" type="date" name="birthday" bind:value={birthday} />
						</div>

						<div class="form-field">
							<label for="statusText">Status <span class="optional">(optional)</span></label>
							<input id="statusText" type="text" name="statusText" maxlength="255" bind:value={statusText} />
						</div>

						<div class="form-field">
							<label for="description">Description <span class="optional">(optional)</span></label>
							<textarea id="description" name="description" bind:value={description}></textarea>
						</div>

						<button type="submit" class="btn" disabled={profileSubmitting}>
							{profileSubmitting ? 'Saving…' : 'Save changes'}
						</button>
					</form>
				</section>
			{:else if tab === 'password'}
				<section class="panel panel-flat">
					<h2>Password</h2>
					<p class="panel-desc">Other sessions are signed out when you change your password.</p>

					{#if passwordError}
						<div class="alert alert-error" role="alert">{passwordError}</div>
					{/if}
					{#if passwordSuccess}
						<div class="alert alert-success" role="status">{passwordSuccess}</div>
					{/if}

					<form onsubmit={handlePasswordSubmit}>
						<div class="form-field">
							<label for="currentPassword">Current password</label>
							<PasswordInput id="currentPassword" name="currentPassword" autocomplete="current-password" required bind:value={currentPassword} />
						</div>
						<div class="form-field">
							<label for="newPassword">New password <span class="optional">(min 8 characters)</span></label>
							<PasswordInput id="newPassword" name="newPassword" autocomplete="new-password" required minlength={8} bind:value={newPassword} />
						</div>
						<div class="form-field">
							<label for="confirmPassword">Confirm new password</label>
							<PasswordInput id="confirmPassword" name="confirmPassword" autocomplete="new-password" required minlength={8} bind:value={confirmPassword} />
						</div>
						<button type="submit" class="btn" disabled={passwordSubmitting}>
							{passwordSubmitting ? 'Changing…' : 'Change password'}
						</button>
					</form>
				</section>
			{:else}
				<AppearancePanel />
			{/if}
		</div>
	</div>
</div>
