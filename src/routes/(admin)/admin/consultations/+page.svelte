<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { updateConsultationStatus } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { roomLabels } from '$lib/consultation/constants';

	let { data } = $props();

	let error = $state('');
	let updatingId = $state(/** @type {number | null} */ (null));

	const consultations = $derived(data.consultations ?? []);

	const statusFilters = [
		{ value: '', label: 'Hamısı' },
		{ value: 'new', label: 'Yeni' },
		{ value: 'contacted', label: 'Əlaqə saxlanıb' },
		{ value: 'closed', label: 'Bağlı' }
	];

	/** @param {string} status */
	function applyStatusFilter(status) {
		const params = new URLSearchParams();
		if (status) params.set('status', status);
		const qs = params.toString();
		goto(qs ? `/admin/consultations?${qs}` : '/admin/consultations');
	}

	/** @param {number} id @param {'contacted' | 'closed'} status */
	async function setStatus(id, status) {
		error = '';
		updatingId = id;
		try {
			await updateConsultationStatus(id, status);
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			updatingId = null;
		}
	}

	/** @param {string} iso */
	function formatDate(iso) {
		return new Date(iso).toLocaleString('az-AZ');
	}

	/** @param {string} status */
	function statusLabel(status) {
		if (status === 'new') return 'Yeni';
		if (status === 'contacted') return 'Əlaqə saxlanıb';
		if (status === 'closed') return 'Bağlı';
		return status;
	}

	/** @param {string} status */
	function statusPillClass(status) {
		if (status === 'new') return 'warning';
		if (status === 'contacted') return 'info';
		return 'neutral';
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

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Konsultasiya siyahısı yüklənmədi.</div>
{/if}

{#if error}
	<div class="adm-alert adm-alert-error" role="alert">{error}</div>
{/if}

<section class="adm-panel">
	<div class="adm-filters">
		<label class="adm-filter-inline">
			Status
			<select
				class="adm-filter-input"
				value={data.statusFilter}
				onchange={(e) => applyStatusFilter(/** @type {HTMLSelectElement} */ (e.currentTarget).value)}
			>
				{#each statusFilters as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</label>
	</div>

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
								<span class="adm-pill adm-pill-{statusPillClass(item.status)}">
									{statusLabel(item.status)}
								</span>
							</td>
							<td class="adm-table-actions">
								{#if item.status === 'new'}
									<button
										type="button"
										class="adm-btn adm-btn-ghost"
										disabled={updatingId === item.id}
										onclick={() => setStatus(item.id, 'contacted')}
									>Əlaqə</button>
								{:else if item.status === 'contacted'}
									<button
										type="button"
										class="adm-btn adm-btn-ghost"
										disabled={updatingId === item.id}
										onclick={() => setStatus(item.id, 'closed')}
									>Bağla</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="adm-empty">
			<p>Konsultasiya müraciəti yoxdur.</p>
			<p style="font-size: 0.875rem;">Müştərilər /consultation səhifəsindən müraciət göndərə bilər.</p>
		</div>
	{/if}
</section>

<style>
	.adm-filter-inline {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--adm-muted);
	}
</style>
