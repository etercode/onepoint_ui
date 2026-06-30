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
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';

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
		{ id: 'account', label: 'Hesab' },
		{ id: 'password', label: 'Şifrə' },
		{ id: 'appearance', label: 'Görünüş' }
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
			profileError = 'Mövcud istifadəçi adı seçin';
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
			profileSuccess = 'Profil yeniləndi';
		} catch (err) {
			profileError = err instanceof ApiClientError ? err.message : 'Yeniləmə alınmadı';
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
			passwordError = 'Yeni şifrələr uyğun gəlmir';
			return;
		}

		passwordSubmitting = true;
		try {
			await changePassword({ currentPassword, newPassword });
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			passwordSuccess = 'Şifrə dəyişdirildi';
		} catch (err) {
			passwordError = err instanceof ApiClientError ? err.message : 'Şifrə dəyişdirilmədi';
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
	<title>Hesab parametrləri — Mirvari Mebel</title>
</svelte:head>

<div class="mp-settings">
	<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Hesab parametrləri' }]} />
	<h1 class="mp-settings-title">Hesab parametrləri</h1>

	<div class="mp-settings-layout">
		<nav class="mp-settings-nav" aria-label="Parametr bölmələri">
			{#each tabs as item}
				<button
					type="button"
					class="mp-settings-nav-item"
					class:mp-settings-nav-item-active={tab === item.id}
					onclick={() => selectTab(/** @type {'account' | 'password' | 'appearance'} */ (item.id))}
				>
					{item.label}
				</button>
			{/each}
		</nav>

		<div class="mp-settings-content">
			{#if tab === 'account'}
				<section class="mp-settings-panel">
					<h2>Profil şəkli</h2>
					{#if photoMessage}
						<div
							class="mp-alert"
							class:mp-alert-error={photoMessageType === 'error'}
							class:mp-alert-success={photoMessageType === 'success'}
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

				<section class="mp-settings-panel">
					<h2>Profil məlumatları</h2>
					<p class="mp-settings-desc">E-poçt burada dəyişdirilə bilməz.</p>

					{#if profileError}
						<div class="mp-alert mp-alert-error" role="alert">{profileError}</div>
					{/if}
					{#if profileSuccess}
						<div class="mp-alert mp-alert-success" role="status">{profileSuccess}</div>
					{/if}

					<form class="mp-form" onsubmit={handleProfileSubmit}>
						{#if auth.user}
							<label for="email">E-poçt</label>
							<input id="email" type="email" value={auth.user.email} disabled />
						{/if}

						<UsernameField
							bind:this={usernameField}
							id="username"
							bind:value={username}
							{originalUsername}
							required
						/>

						<div class="mp-form-row">
							<label for="name">
								Ad
								<input id="name" type="text" name="name" required bind:value={name} />
							</label>
							<label for="lastname">
								Soyad
								<input id="lastname" type="text" name="lastname" required bind:value={lastname} />
							</label>
						</div>

						<div class="mp-form-row">
							<label for="timezone">
								Saat qurşağı <span class="mp-optional">(istəyə bağlı)</span>
								<input id="timezone" type="text" name="timezone" placeholder="Asia/Baku" maxlength="64" bind:value={timezone} />
							</label>
							<label for="language">
								Dil <span class="mp-optional">(istəyə bağlı)</span>
								<input id="language" type="text" name="language" placeholder="az" maxlength="12" bind:value={language} />
							</label>
						</div>

						<label for="birthday">
							Doğum tarixi <span class="mp-optional">(istəyə bağlı)</span>
							<input id="birthday" type="date" name="birthday" bind:value={birthday} />
						</label>

						<label for="statusText">
							Status <span class="mp-optional">(istəyə bağlı)</span>
							<input id="statusText" type="text" name="statusText" maxlength="255" bind:value={statusText} />
						</label>

						<label for="description">
							Təsvir <span class="mp-optional">(istəyə bağlı)</span>
							<textarea id="description" name="description" bind:value={description}></textarea>
						</label>

						<button type="submit" class="mp-btn-primary" disabled={profileSubmitting}>
							{profileSubmitting ? 'Saxlanılır…' : 'Dəyişiklikləri saxla'}
						</button>
					</form>
				</section>
			{:else if tab === 'password'}
				<section class="mp-settings-panel">
					<h2>Şifrə</h2>
					<p class="mp-settings-desc">Şifrəni dəyişdikdə digər sessiyalar bağlanır.</p>

					{#if passwordError}
						<div class="mp-alert mp-alert-error" role="alert">{passwordError}</div>
					{/if}
					{#if passwordSuccess}
						<div class="mp-alert mp-alert-success" role="status">{passwordSuccess}</div>
					{/if}

					<form class="mp-form" onsubmit={handlePasswordSubmit}>
						<label for="currentPassword">
							Cari şifrə
							<PasswordInput id="currentPassword" name="currentPassword" autocomplete="current-password" required bind:value={currentPassword} />
						</label>
						<label for="newPassword">
							Yeni şifrə <span class="mp-optional">(min. 8 simvol)</span>
							<PasswordInput id="newPassword" name="newPassword" autocomplete="new-password" required minlength={8} bind:value={newPassword} />
						</label>
						<label for="confirmPassword">
							Yeni şifrəni təsdiqlə
							<PasswordInput id="confirmPassword" name="confirmPassword" autocomplete="new-password" required minlength={8} bind:value={confirmPassword} />
						</label>
						<button type="submit" class="mp-btn-primary" disabled={passwordSubmitting}>
							{passwordSubmitting ? 'Dəyişdirilir…' : 'Şifrəni dəyiş'}
						</button>
					</form>
				</section>
			{:else}
				<AppearancePanel />
			{/if}
		</div>
	</div>
</div>
