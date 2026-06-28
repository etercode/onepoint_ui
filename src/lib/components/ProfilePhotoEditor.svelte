<script>
	import { ApiClientError, uploadProfilePhoto } from '$lib/api/client';
	import { auth } from '$lib/auth/auth.svelte';
	import { resolveApiUrl } from '$lib/config';
	import ImageCropper from '$lib/components/ImageCropper.svelte';

	let {
		preview = $bindable(null),
		onSuccess = () => {},
		onError = () => {}
	} = $props();

	let cropFile = $state(/** @type {File | null} */ (null));
	let uploading = $state(false);
	let inputEl = $state(/** @type {HTMLInputElement | undefined} */ (undefined));

	/** @param {Event} event */
	function handleFilePick(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			onError('Please choose an image file');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			onError('Image must be 5 MB or smaller');
			return;
		}
		cropFile = file;
	}

	async function handleCropConfirm(/** @type {File} */ file) {
		cropFile = null;
		uploading = true;
		try {
			const result = await uploadProfilePhoto(file);
			preview = resolveApiUrl(result.url);
			await auth.fetchUser();
			onSuccess('Photo updated');
		} catch (err) {
			onError(err instanceof ApiClientError ? err.message : 'Upload failed');
		} finally {
			uploading = false;
		}
	}

	function openPicker() {
		inputEl?.click();
	}
</script>

<div class="photo-editor">
	<div class="avatar avatar-xl">
		{#if preview}
			<img src={preview} alt="Profile" />
		{:else}
			<span class="avatar-placeholder">?</span>
		{/if}
	</div>
	<div class="photo-editor-actions">
		<button type="button" class="btn btn-soft" disabled={uploading} onclick={openPicker}>
			{uploading ? 'Uploading…' : 'Change photo'}
		</button>
		<p class="photo-editor-hint">JPEG, PNG or WebP · max 5 MB · crop before upload</p>
	</div>
	<input
		bind:this={inputEl}
		type="file"
		accept="image/jpeg,image/png,image/webp"
		hidden
		onchange={handleFilePick}
	/>
</div>

{#if cropFile}
	<ImageCropper
		file={cropFile}
		onConfirm={handleCropConfirm}
		onCancel={() => (cropFile = null)}
	/>
{/if}
