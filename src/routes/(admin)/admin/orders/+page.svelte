<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { getOrder, updateOrderStatus } from '$lib/api/client';
	import { formatAdminError } from '$lib/admin/api-errors';
	import { formatPrice, orderStatusPillClass, orderStatuses } from '$lib/admin/data';

	let { data } = $props();

	let error = $state('');
	let updatingId = $state(/** @type {number | null} */ (null));
	let expandedId = $state(/** @type {number | null} */ (null));
	let orderDetails = $state(/** @type {Record<number, Record<string, unknown>>} */ ({}));
	let loadingDetailId = $state(/** @type {number | null} */ (null));

	const orders = $derived(data.orders ?? []);
	const statusKeys = Object.keys(orderStatuses);

	/** @param {string} status */
	function applyStatusFilter(status) {
		const params = new URLSearchParams();
		if (status) params.set('status', status);
		const qs = params.toString();
		goto(qs ? `/admin/orders?${qs}` : '/admin/orders');
	}

	/** @param {number} id @param {string} status */
	async function handleStatusChange(id, status) {
		error = '';
		updatingId = id;
		try {
			await updateOrderStatus(id, status);
			await invalidateAll();
		} catch (err) {
			error = formatAdminError(err);
		} finally {
			updatingId = null;
		}
	}

	/** @param {number} id */
	async function toggleDetail(id) {
		if (expandedId === id) {
			expandedId = null;
			return;
		}

		expandedId = id;
		if (orderDetails[id]) return;

		loadingDetailId = id;
		try {
			orderDetails[id] = await getOrder(id);
		} catch (err) {
			error = formatAdminError(err);
			expandedId = null;
		} finally {
			loadingDetailId = null;
		}
	}
</script>

<svelte:head>
	<title>Sifarişlər — Mirvari Mebel Admin</title>
</svelte:head>

<div class="adm-page-header">
	<div>
		<h1>Sifarişlər</h1>
		<p>Bütün müştəri sifarişlərinin idarə edilməsi</p>
	</div>
</div>

{#if data.apiUnavailable}
	<div class="adm-alert adm-alert-warn" role="status">Sifariş siyahısı yüklənmədi.</div>
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
				<option value="">Hamısı</option>
				{#each statusKeys as status}
					<option value={status}>{orderStatuses[/** @type {keyof typeof orderStatuses} */ (status)].label}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="adm-table-wrap">
		<table class="adm-table">
			<thead>
				<tr>
					<th>Sifariş №</th>
					<th>Müştəri</th>
					<th>E-poçt</th>
					<th>Məhsul</th>
					<th>Məbləğ</th>
					<th>Tarix</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each orders as order}
					<tr>
						<td><strong>{order.orderNumber}</strong></td>
						<td>{order.customer}</td>
						<td>{order.email}</td>
						<td>{order.items}</td>
						<td><strong>{formatPrice(order.total)}</strong></td>
						<td>{order.date}</td>
						<td>
							<select
								class="adm-filter-input adm-status-select"
								value={order.status}
								disabled={updatingId === order.id}
								onchange={(e) => handleStatusChange(order.id, /** @type {HTMLSelectElement} */ (e.currentTarget).value)}
							>
								{#each statusKeys as status}
									<option value={status}>{orderStatuses[/** @type {keyof typeof orderStatuses} */ (status)].label}</option>
								{/each}
							</select>
						</td>
						<td>
							<button type="button" class="adm-btn adm-btn-ghost" onclick={() => toggleDetail(order.id)}>
								{expandedId === order.id ? 'Gizlət' : 'Detallar'}
							</button>
						</td>
					</tr>
					{#if expandedId === order.id}
						<tr class="adm-table-detail-row">
							<td colspan="8">
								{#if loadingDetailId === order.id}
									<p class="adm-empty">Yüklənir…</p>
								{:else if orderDetails[order.id]}
									{@const detail = orderDetails[order.id]}
									{@const lines = detail.lines ?? detail.items ?? []}
									{#if lines.length > 0}
										<ul class="adm-order-lines">
											{#each lines as line}
												<li>
													<strong>{line.productName ?? line.name}</strong>
													<span>× {line.quantity} · {formatPrice(line.price ?? line.unitPrice)}</span>
												</li>
											{/each}
										</ul>
									{:else}
										<p class="adm-empty">Sətir məlumatı yoxdur.</p>
									{/if}
								{:else}
									<p class="adm-empty">Sətir məlumatı yoxdur.</p>
								{/if}
							</td>
						</tr>
					{/if}
				{:else}
					<tr>
						<td colspan="8" class="adm-empty">Sifariş tapılmadı.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
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

	.adm-status-select {
		min-width: 9rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.8125rem;
	}

	.adm-table-detail-row td {
		background: var(--adm-surface-2);
	}

	.adm-order-lines {
		margin: 0;
		padding-left: 1.25rem;
	}

	.adm-order-lines li {
		margin-bottom: 0.375rem;
		font-size: 0.875rem;
	}

	.adm-order-lines span {
		color: var(--adm-muted);
		margin-left: 0.5rem;
	}
</style>
