<script>
	let { file, onConfirm, onCancel } = $props();

	const VIEWPORT = 300;
	const CROP_SIZE = 240;
	const OUTPUT = 512;

	let canvasEl = $state(/** @type {HTMLCanvasElement | undefined} */ (undefined));
	let image = $state(/** @type {HTMLImageElement | null} */ (null));
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let minZoom = $state(1);
	let dragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let panStartX = 0;
	let panStartY = 0;

	$effect(() => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			image = img;
			resetTransform();
			draw();
		};
		img.src = url;
		return () => URL.revokeObjectURL(url);
	});

	$effect(() => {
		if (image && canvasEl) draw();
	});

	function resetTransform() {
		if (!image) return;
		const scaleX = CROP_SIZE / image.width;
		const scaleY = CROP_SIZE / image.height;
		minZoom = Math.max(scaleX, scaleY);
		zoom = minZoom * 1.1;
		panX = 0;
		panY = 0;
	}

	function draw() {
		if (!canvasEl || !image) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		canvasEl.width = VIEWPORT * dpr;
		canvasEl.height = VIEWPORT * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		ctx.fillStyle = '#111';
		ctx.fillRect(0, 0, VIEWPORT, VIEWPORT);

		const drawW = image.width * zoom;
		const drawH = image.height * zoom;
		const x = VIEWPORT / 2 - drawW / 2 + panX;
		const y = VIEWPORT / 2 - drawH / 2 + panY;
		ctx.drawImage(image, x, y, drawW, drawH);

		ctx.fillStyle = 'rgba(0,0,0,0.55)';
		ctx.beginPath();
		ctx.rect(0, 0, VIEWPORT, VIEWPORT);
		ctx.arc(VIEWPORT / 2, VIEWPORT / 2, CROP_SIZE / 2, 0, Math.PI * 2, true);
		ctx.fill('evenodd');

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(VIEWPORT / 2, VIEWPORT / 2, CROP_SIZE / 2, 0, Math.PI * 2);
		ctx.stroke();
	}

	function clampPan() {
		if (!image) return;
		const drawW = image.width * zoom;
		const drawH = image.height * zoom;
		const maxPanX = Math.max(0, (drawW - CROP_SIZE) / 2);
		const maxPanY = Math.max(0, (drawH - CROP_SIZE) / 2);
		panX = Math.min(maxPanX, Math.max(-maxPanX, panX));
		panY = Math.min(maxPanY, Math.max(-maxPanY, panY));
	}

	/** @param {PointerEvent} event */
	function onPointerDown(event) {
		dragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		panStartX = panX;
		panStartY = panY;
		/** @type {HTMLElement} */ (event.currentTarget).setPointerCapture(event.pointerId);
	}

	/** @param {PointerEvent} event */
	function onPointerMove(event) {
		if (!dragging) return;
		panX = panStartX + (event.clientX - dragStartX);
		panY = panStartY + (event.clientY - dragStartY);
		clampPan();
		draw();
	}

	/** @param {PointerEvent} event */
	function onPointerUp(event) {
		dragging = false;
		/** @type {HTMLElement} */ (event.currentTarget).releasePointerCapture(event.pointerId);
	}

	function onZoomInput() {
		clampPan();
		draw();
	}

	function exportBlob() {
		return new Promise((resolve, reject) => {
			if (!image) {
				reject(new Error('No image'));
				return;
			}

			const out = document.createElement('canvas');
			out.width = OUTPUT;
			out.height = OUTPUT;
			const ctx = out.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas unavailable'));
				return;
			}

			const drawW = image.width * zoom;
			const drawH = image.height * zoom;
			const imgX = VIEWPORT / 2 - drawW / 2 + panX;
			const imgY = VIEWPORT / 2 - drawH / 2 + panY;
			const cropX = VIEWPORT / 2 - CROP_SIZE / 2;
			const cropY = VIEWPORT / 2 - CROP_SIZE / 2;
			const ratio = OUTPUT / CROP_SIZE;

			ctx.beginPath();
			ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
			ctx.clip();

			ctx.drawImage(
				image,
				(cropX - imgX) / zoom,
				(cropY - imgY) / zoom,
				CROP_SIZE / zoom,
				CROP_SIZE / zoom,
				0,
				0,
				OUTPUT,
				OUTPUT
			);

			out.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error('Export failed'));
				},
				'image/webp',
				0.92
			);
		});
	}

	async function handleConfirm() {
		const blob = await exportBlob();
		const cropped = new File([blob], 'profile.webp', { type: 'image/webp' });
		onConfirm(cropped);
	}
</script>

<div class="cropper-backdrop" role="presentation" onclick={(e) => e.target === e.currentTarget && onCancel()}>
	<div class="cropper-modal" role="dialog" aria-labelledby="cropper-title" aria-modal="true">
		<header class="cropper-header">
			<h2 id="cropper-title">Edit photo</h2>
			<p>Drag to reposition · use zoom to adjust</p>
		</header>

		<div
			class="cropper-stage"
			role="application"
			aria-label="Drag to reposition photo, use zoom slider to scale"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<canvas bind:this={canvasEl} class="cropper-canvas" width={VIEWPORT} height={VIEWPORT}></canvas>
		</div>

		<div class="cropper-controls">
			<label for="crop-zoom">Zoom</label>
			<input
				id="crop-zoom"
				type="range"
				min={minZoom}
				max={minZoom * 3}
				step="0.01"
				bind:value={zoom}
				oninput={onZoomInput}
			/>
		</div>

		<footer class="cropper-actions">
			<button type="button" class="btn btn-ghost" onclick={onCancel}>Cancel</button>
			<button type="button" class="btn" onclick={handleConfirm}>Save photo</button>
		</footer>
	</div>
</div>

<style>
	.cropper-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: var(--overlay);
		backdrop-filter: blur(4px);
	}

	.cropper-modal {
		width: min(100%, 22rem);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		overflow: hidden;
	}

	.cropper-header {
		padding: 1rem 1.25rem 0.5rem;
	}

	.cropper-header h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.cropper-header p {
		margin: 0.25rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-muted);
	}

	.cropper-stage {
		touch-action: none;
		cursor: grab;
		padding: 0 1.25rem;
	}

	.cropper-stage:active {
		cursor: grabbing;
	}

	.cropper-canvas {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
		display: block;
	}

	.cropper-controls {
		padding: 1rem 1.25rem 0.5rem;
		display: grid;
		gap: 0.5rem;
	}

	.cropper-controls label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	.cropper-controls input[type='range'] {
		width: 100%;
		accent-color: var(--color-primary);
	}

	.cropper-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding: 1rem 1.25rem 1.25rem;
	}

	.cropper-actions .btn {
		width: auto;
		min-width: 6rem;
	}
</style>
