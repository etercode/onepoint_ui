<script>
	import { onMount } from 'svelte';
	import { loadConsultations, roomLabels, updateConsultationStatus } from '$lib/admin/consultations';

	/** @type {import('$lib/admin/consultations').Consultation[]} */
	let consultations = $state([]);

	onMount(() => {
		consultations = loadConsultations();
	});

	/** @param {string} id @param {import('$lib/admin/consultations').Consultation['status']} status */
	function setStatus(id, status) {
		updateConsultationStatus(id, status);
		consultations = loadConsultations();
	}

	/** @param {string} iso */
	function formatDate(iso) {
		return new Date(iso).toLocaleString('az-AZ');
	}
</script>

<svelte:head>
	<title>Konsultasiyalar — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Konsultasiyalar</h1>
		<p>Mağazadan gələn pulsuz dizayn müraciətləri</p>
	</div>
</div>

<section class="adm-panel">
	{#if consultations.length > 0}
		<div class="adm-table-wrap">
			<table class="adm-table">
				<thead>
					<tr>
						<th>Ad</th>
						<th>Telefon</th>
						<th>Otaq</th>
						<th>Mesaj</th>
						<th>Tarix</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each consultations as item}
						<tr>
							<td><strong>{item.name}</strong></td>
							<td>{item.phone}</td>
							<td>{roomLabels[item.room] ?? item.room}</td>
							<td>{item.message || '—'}</td>
							<td>{formatDate(item.createdAt)}</td>
							<td>
								<span class="adm-pill adm-pill-{item.status === 'new' ? 'warning' : item.status === 'contacted' ? 'info' : 'neutral'}">
									{item.status === 'new' ? 'Yeni' : item.status === 'contacted' ? 'Əlaqə saxlanıb' : 'Bağlı'}
								</span>
							</td>
							<td>
								{#if item.status === 'new'}
									<button type="button" class="adm-btn adm-btn-ghost" onclick={() => setStatus(item.id, 'contacted')}>Əlaqə</button>
								{:else if item.status === 'contacted'}
									<button type="button" class="adm-btn adm-btn-ghost" onclick={() => setStatus(item.id, 'closed')}>Bağla</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="adm-empty">
			<p>Hələ konsultasiya müraciəti yoxdur.</p>
			<p style="font-size: 0.875rem;">Müştərilər /consultation səhifəsindən müraciət göndərə bilər.</p>
		</div>
	{/if}
</section>
