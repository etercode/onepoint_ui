<script>
	import Breadcrumbs from '$lib/components/marketplace/Breadcrumbs.svelte';
	import { saveConsultation } from '$lib/admin/consultations';
	import PageHero from '$lib/components/marketplace/PageHero.svelte';

	let name = $state('');
	let phone = $state('');
	let room = $state('living-room');
	let message = $state('');
	let submitted = $state(false);

	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
		event.preventDefault();
		saveConsultation({ name, phone, room, message });
		submitted = true;
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
						<option value="living-room">Qonaq otağı</option>
						<option value="bedroom">Yataq otağı</option>
						<option value="kitchen">Mətbəx / yemək otağı</option>
						<option value="kids">Uşaq otağı</option>
						<option value="office">Ev ofisi</option>
					</select>
				</label>
				<label>
					Qısa təsvir
					<textarea name="message" bind:value={message} rows="4" placeholder="Ölçü, üslub, büdcə haqqında qısa məlumat…"></textarea>
				</label>
				<button type="submit" class="mp-btn-primary">Göndər</button>
			</form>
		{/if}
	</div>
</main>
