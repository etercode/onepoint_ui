<script>
	import { checkUsernameAvailable } from '$lib/api/client';

	let {
		id,
		name = 'username',
		required = false,
		minlength = 3,
		originalUsername = '',
		value = $bindable('')
	} = $props();

	let status = $state('idle');
	let message = $state('');
	let timer = /** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined);

	function scheduleCheck() {
		clearTimeout(timer);
		status = 'idle';
		message = '';

		const trimmed = value.trim();
		if (trimmed.length < minlength) return;
		if (originalUsername && trimmed === originalUsername) {
			status = 'available';
			message = 'Current username';
			return;
		}

		status = 'checking';
		timer = setTimeout(async () => {
			try {
				const result = await checkUsernameAvailable(trimmed);
				if (value.trim() !== trimmed) return;
				if (result.available) {
					status = 'available';
					message = 'Username is available';
				} else {
					status = 'taken';
					message = 'Username is already taken';
				}
			} catch {
				if (value.trim() !== trimmed) return;
				status = 'error';
				message = 'Could not check availability';
			}
		}, 400);
	}

	export function isAvailable() {
		const trimmed = value.trim();
		if (trimmed.length < minlength) return false;
		if (originalUsername && trimmed === originalUsername) return true;
		return status === 'available';
	}

	export async function validate() {
		const trimmed = value.trim();
		if (trimmed.length < minlength) return false;
		if (originalUsername && trimmed === originalUsername) return true;

		clearTimeout(timer);
		status = 'checking';
		message = '';

		try {
			const result = await checkUsernameAvailable(trimmed);
			if (value.trim() !== trimmed) return false;
			if (result.available) {
				status = 'available';
				message = 'Username is available';
				return true;
			}
			status = 'taken';
			message = 'Username is already taken';
			return false;
		} catch {
			if (value.trim() !== trimmed) return false;
			status = 'error';
			message = 'Could not check availability';
			return false;
		}
	}
</script>

<div class="form-field">
	<label for={id}>Username</label>
	<input
		{id}
		type="text"
		{name}
		autocomplete="username"
		{required}
		{minlength}
		bind:value
		oninput={scheduleCheck}
	/>
	{#if message}
		<p class="field-hint field-hint-{status}" role="status">{message}</p>
	{/if}
</div>
