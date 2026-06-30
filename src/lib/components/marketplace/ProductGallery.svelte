<script>
	import { resolveApiUrl } from '$lib/config';

	/** @type {{ product: Record<string, unknown> }} */
	let { product } = $props();

	const MIN_ZOOM = 1;
	const MAX_ZOOM = 3;
	const ZOOM_STEP = 0.25;

	/** @param {Record<string, unknown>} p */
	function galleryImages(p) {
		const images = p.images;
		if (Array.isArray(images) && images.length > 0) return images;
		if (p.image) return [{ id: 0, url: p.image }];
		return [];
	}

	let selectedIndex = $state(0);
	let lightboxOpen = $state(false);
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let dragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let panStartX = 0;
	let panStartY = 0;

	const images = $derived(galleryImages(product));
	const hasMultiple = $derived(images.length > 1);
	const mainUrl = $derived(
		images[selectedIndex] ? resolveApiUrl(String(images[selectedIndex].url)) : null
	);
	const lightboxTransform = $derived(`translate(${panX}px, ${panY}px) scale(${zoom})`);

	$effect(() => {
		product.id;
		selectedIndex = 0;
		closeLightbox();
	});

	$effect(() => {
		if (!lightboxOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});

	function resetZoomPan() {
		zoom = 1;
		panX = 0;
		panY = 0;
	}

	function openLightbox() {
		if (!mainUrl) return;
		resetZoomPan();
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
		resetZoomPan();
	}

	/** @param {number} index */
	function selectImage(index) {
		selectedIndex = index;
		resetZoomPan();
	}

	function prevImage() {
		if (!hasMultiple) return;
		selectedIndex = (selectedIndex - 1 + images.length) % images.length;
		resetZoomPan();
	}

	function nextImage() {
		if (!hasMultiple) return;
		selectedIndex = (selectedIndex + 1) % images.length;
		resetZoomPan();
	}

	/** @param {number} delta */
	function adjustZoom(delta) {
		const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
		if (next === 1) {
			panX = 0;
			panY = 0;
		}
		zoom = next;
	}

	/** @param {WheelEvent} event */
	function onLightboxWheel(event) {
		event.preventDefault();
		adjustZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
	}

	/** @param {PointerEvent} event */
	function onPanStart(event) {
		if (zoom <= 1) return;
		dragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		panStartX = panX;
		panStartY = panY;
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	/** @param {PointerEvent} event */
	function onPanMove(event) {
		if (!dragging) return;
		panX = panStartX + (event.clientX - dragStartX);
		panY = panStartY + (event.clientY - dragStartY);
	}

	/** @param {PointerEvent} event */
	function onPanEnd(event) {
		if (!dragging) return;
		dragging = false;
		event.currentTarget.releasePointerCapture(event.pointerId);
	}

	/** @param {MouseEvent} event */
	function onBackdropClick(event) {
		if (event.target === event.currentTarget) closeLightbox();
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (!lightboxOpen) return;
		if (event.key === 'Escape') {
			closeLightbox();
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prevImage();
			return;
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextImage();
			return;
		}
		if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			adjustZoom(ZOOM_STEP);
			return;
		}
		if (event.key === '-') {
			event.preventDefault();
			adjustZoom(-ZOOM_STEP);
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mp-product-gallery">
	{#if mainUrl}
		<div class="mp-product-gallery-main">
			{#if hasMultiple}
				<button
					type="button"
					class="mp-gallery-arrow mp-gallery-arrow-prev"
					aria-label="Əvvəlki şəkil"
					onclick={prevImage}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
				</button>
			{/if}

			<button
				type="button"
				class="mp-gallery-main-trigger"
				aria-label="Şəkli böyüt"
				onclick={openLightbox}
			>
				<img src={mainUrl} alt={product.name} />
			</button>

			{#if hasMultiple}
				<button
					type="button"
					class="mp-gallery-arrow mp-gallery-arrow-next"
					aria-label="Növbəti şəkil"
					onclick={nextImage}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
				</button>
			{/if}

			{#if hasMultiple}
				<span class="mp-gallery-counter">{selectedIndex + 1} / {images.length}</span>
			{/if}
		</div>
	{/if}

	{#if hasMultiple}
		<div class="mp-product-gallery-thumbs" role="listbox" aria-label="Şəkil qalereyası">
			{#each images as img, i}
				<button
					type="button"
					class="mp-product-gallery-thumb"
					class:active={i === selectedIndex}
					role="option"
					aria-selected={i === selectedIndex}
					aria-label="Şəkil {i + 1}"
					onclick={() => selectImage(i)}
				>
					<img src={resolveApiUrl(String(img.url))} alt="" loading="lazy" />
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if lightboxOpen && mainUrl}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="mp-gallery-lightbox"
		role="presentation"
		onclick={onBackdropClick}
		onkeydown={onKeydown}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="mp-gallery-lightbox-panel"
			role="dialog"
			aria-modal="true"
			aria-label="Şəkil önizləməsi"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={onKeydown}
		>
			<div class="mp-gallery-lightbox-toolbar">
				<span class="mp-gallery-lightbox-count">
					{selectedIndex + 1} / {images.length}
				</span>
				<div class="mp-gallery-lightbox-zoom">
					<button type="button" class="mp-gallery-lightbox-btn" aria-label="Kiçilt" disabled={zoom <= MIN_ZOOM} onclick={() => adjustZoom(-ZOOM_STEP)}>−</button>
					<span>{Math.round(zoom * 100)}%</span>
					<button type="button" class="mp-gallery-lightbox-btn" aria-label="Böyüt" disabled={zoom >= MAX_ZOOM} onclick={() => adjustZoom(ZOOM_STEP)}>+</button>
				</div>
				<button type="button" class="mp-gallery-lightbox-close" aria-label="Bağla" onclick={closeLightbox}>×</button>
			</div>

			<div class="mp-gallery-lightbox-body">
				{#if hasMultiple}
					<button type="button" class="mp-gallery-lightbox-arrow mp-gallery-lightbox-arrow-prev" aria-label="Əvvəlki şəkil" onclick={prevImage}>
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
					</button>
					<button type="button" class="mp-gallery-lightbox-arrow mp-gallery-lightbox-arrow-next" aria-label="Növbəti şəkil" onclick={nextImage}>
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
					</button>
				{/if}

				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="mp-gallery-lightbox-stage"
					class:mp-gallery-lightbox-stage-grab={zoom > 1 && !dragging}
					class:mp-gallery-lightbox-stage-grabbing={dragging}
					onwheel={onLightboxWheel}
					onpointerdown={onPanStart}
					onpointermove={onPanMove}
					onpointerup={onPanEnd}
					onpointercancel={onPanEnd}
					ondblclick={() => (zoom > 1 ? resetZoomPan() : adjustZoom(1))}
				>
					<img
						class="mp-gallery-lightbox-image"
						src={mainUrl}
						alt={product.name}
						style:transform={lightboxTransform}
						draggable="false"
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
