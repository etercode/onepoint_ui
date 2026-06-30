<script>
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';
	import { ApiClientError, submitConsultation } from '$lib/api/client';
	import { consultationRoomOptions } from '$lib/consultation/constants';

	let name = $state('');
	let phone = $state('');
	let room = $state('living-room');
	let message = $state('');
	let submitted = $state(false);
	let error = $state('');
	let submitting = $state(false);

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		submitting = true;

		try {
			await submitConsultation({ name, phone, room, message });
			submitted = true;
		} catch (err) {
			error = err instanceof ApiClientError ? err.message : 'Göndərmək alınmadı. Yenidən cəhd edin.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Konsultasiya — Mirvari Mebel</title>
</svelte:head>

<PageHero title="Pulsuz konsultasiya" subtitle="Dizaynerlərimiz sizin üçün ideal mebel həllini seçsin.">
	{#snippet children()}
		<Breadcrumbs items={[{ label: 'Ana səhifə', href: '/' }, { label: 'Konsultasiya' }]} />
	{/snippet}
</PageHero>

<main class="mp-inner-main">
	<div class="mp-container">
		{#if submitted}
			<div class="mp-form-success">
				Təşəkkürlər, {name}! Tezliklə sizinlə əlaqə saxlayacağıq.
			</div>
		{:else}
			{#if error}
				<div class="mp-form-error" role="alert">{error}</div>
			{/if}

			<form class="mp-form" onsubmit={handleSubmit}>
				<label>
					Ad, soyad
					<input type="text" name="name" bind:value={name} required autocomplete="name" />
				</label>
				<label>
					Telefon
					<input type="tel" name="phone" bind:value={phone} required autocomplete="tel" placeholder="+994 50 000 00 00" />
				</label>
				<label>
					Otaq növü
					<select name="room" bind:value={room}>
						{#each consultationRoomOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</label>
				<label>
					Qısa təsvir
					<textarea name="message" bind:value={message} rows="4" placeholder="Ölçü, üslub, büdcə haqqında qısa məlumat…"></textarea>
				</label>
				<button type="submit" class="mp-btn-primary" disabled={submitting}>
					{submitting ? 'Göndərilir…' : 'Göndər'}
				</button>
			</form>
		{/if}
	</div>
</main>
