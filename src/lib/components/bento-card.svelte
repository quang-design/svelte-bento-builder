<script lang="ts">
	import { tick } from 'svelte';
	import { X } from '@lucide/svelte';
	import type { GridItem, CornerRadius } from '$lib/types/bento';

	type Props = {
		item: GridItem;
		cornerRadius?: CornerRadius;
		cols?: number;
		rows?: number;
		gridItems?: GridItem[];
		onSwap?: (item1: GridItem, item2: GridItem) => void;
		onDelete?: (id: number) => void;
		onUpdateItem?: (item: GridItem) => void;
		startInEditMode?: boolean;
	};

	let {
		item = $bindable(),
		cornerRadius = 'md',
		cols = 12,
		rows = 6,
		gridItems = [],
		onSwap = undefined,
		onDelete = undefined,
		onUpdateItem = undefined,
		startInEditMode = false
	}: Props = $props();

	item.col = item.col ?? 1;
	item.row = item.row ?? 1;
	item.colSpan = item.colSpan ?? 1;
	item.rowSpan = item.rowSpan ?? 1;

	let isDragging = $state(false);
	let isResizing = $state(false);
	let isEditing = $state(false);
	let isSelected = $state(false);
	let resizeHandle = $state<null | 'se' | 'sw' | 'ne' | 'nw'>(null);
	let startX = $state(0);
	let startY = $state(0);
	let startCol = $state(0);
	let startRow = $state(0);
	let startColSpan = $state(0);
	let startRowSpan = $state(0);
	let originalZIndex = $state<string>('');
	let editText = $state('');

	// Touch drag requires a hold before dragging to avoid interfering with page scroll
	let touchHoldTimer: ReturnType<typeof setTimeout> | null = null;
	let touchDragReady = $state(false);
	let pendingTouchEvent: TouchEvent | null = null;
	const TOUCH_HOLD_MS = 200;

	function getCellSize() {
		const gridContainer = document.querySelector('[data-bento-grid]');
		if (!gridContainer) return { cellWidth: 0, cellHeight: 0 };
		const style = getComputedStyle(gridContainer);
		const gapCol = parseFloat(style.columnGap) || 0;
		const gapRow = parseFloat(style.rowGap) || 0;
		return {
			cellWidth: (gridContainer.clientWidth + gapCol) / cols,
			cellHeight: (gridContainer.clientHeight + gapRow) / rows
		};
	}

	function ensureNumberValue(value: number | undefined): number {
		return typeof value === 'number' ? value : 1;
	}

	function findCardAtPosition(col: number, row: number): GridItem | undefined {
		return gridItems.find((gridItem) => {
			if (gridItem.id === item.id) return false;
			const itemCol = ensureNumberValue(gridItem.col);
			const itemRow = ensureNumberValue(gridItem.row);
			const itemColSpan = ensureNumberValue(gridItem.colSpan);
			const itemRowSpan = ensureNumberValue(gridItem.rowSpan);
			return (
				col >= itemCol &&
				col < itemCol + itemColSpan &&
				row >= itemRow &&
				row < itemRow + itemRowSpan
			);
		});
	}

	// Unified pointer helpers to support both mouse and touch
	function getPointerXY(e: MouseEvent | TouchEvent): { x: number; y: number } {
		if ('touches' in e) {
			const touch = e.touches[0] || e.changedTouches[0];
			return { x: touch.clientX, y: touch.clientY };
		}
		return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
	}

	function startDrag(e: MouseEvent | TouchEvent) {
		if (resizeHandle || isEditing) return;

		// For touch: don't preventDefault immediately — let the browser scroll.
		// Instead, start a hold timer. Drag only activates after holding.
		if ('touches' in e) {
			pendingTouchEvent = e;
			const { x, y } = getPointerXY(e);
			startX = x;
			startY = y;
			touchDragReady = false;
			touchHoldTimer = setTimeout(() => {
				touchDragReady = true;
				activateDrag(pendingTouchEvent!);
			}, TOUCH_HOLD_MS);
			// Listen for touchmove to cancel hold if user scrolls
			window.addEventListener('touchmove', cancelTouchHoldOnScroll, { passive: true });
			window.addEventListener('touchend', cancelTouchHold);
			return;
		}

		e.preventDefault();
		activateDrag(e);
	}

	function cancelTouchHoldOnScroll(e: TouchEvent) {
		if (touchDragReady) return; // already activated
		const { x, y } = getPointerXY(e);
		const dist = Math.abs(x - startX) + Math.abs(y - startY);
		if (dist > 10) {
			cancelTouchHold();
		}
	}

	function cancelTouchHold() {
		if (touchHoldTimer) {
			clearTimeout(touchHoldTimer);
			touchHoldTimer = null;
		}
		pendingTouchEvent = null;
		window.removeEventListener('touchmove', cancelTouchHoldOnScroll);
		window.removeEventListener('touchend', cancelTouchHold);
	}

	function activateDrag(e: MouseEvent | TouchEvent) {
		isDragging = true;
		isSelected = true;
		const card = document.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
		if (card) {
			originalZIndex = card.style.zIndex || '10';
			card.style.zIndex = '100';
		}
		const { x, y } = getPointerXY(e);
		startX = x;
		startY = y;
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);
		window.removeEventListener('touchmove', cancelTouchHoldOnScroll);
		window.removeEventListener('touchend', cancelTouchHold);
		window.addEventListener('mousemove', handlePointerMove);
		window.addEventListener('mouseup', stopDragResize);
		window.addEventListener('touchmove', handlePointerMove, { passive: false });
		window.addEventListener('touchend', stopDragResize);
	}

	function startResize(e: MouseEvent | TouchEvent, handle: 'se' | 'sw' | 'ne' | 'nw') {
		e.preventDefault();
		e.stopPropagation();
		isResizing = true;
		resizeHandle = handle;
		const { x, y } = getPointerXY(e);
		startX = x;
		startY = y;
		startColSpan = ensureNumberValue(item.colSpan);
		startRowSpan = ensureNumberValue(item.rowSpan);
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);
		window.addEventListener('mousemove', handlePointerMove);
		window.addEventListener('mouseup', stopDragResize);
		window.addEventListener('touchmove', handlePointerMove, { passive: false });
		window.addEventListener('touchend', stopDragResize);
	}

	function handlePointerMove(e: MouseEvent | TouchEvent) {
		e.preventDefault();
		const { cellWidth, cellHeight } = getCellSize();
		if (cellWidth === 0 || cellHeight === 0) return;
		const { x, y } = getPointerXY(e);
		const deltaX = Math.round((x - startX) / cellWidth);
		const deltaY = Math.round((y - startY) / cellHeight);

		if (isDragging) {
			const itemColSpan = ensureNumberValue(item.colSpan);
			const itemRowSpan = ensureNumberValue(item.rowSpan);
			item.col = Math.max(1, Math.min(cols - itemColSpan + 1, startCol + deltaX));
			item.row = Math.max(1, startRow + deltaY);
		} else if (isResizing) {
			switch (resizeHandle) {
				case 'se': {
					const ic = ensureNumberValue(item.col);
					item.colSpan = Math.max(1, Math.min(cols - ic + 1, startColSpan + deltaX));
					item.rowSpan = Math.max(1, startRowSpan + deltaY);
					break;
				}
				case 'sw': {
					const newColSpan = Math.max(1, startColSpan - deltaX);
					item.col = Math.max(1, Math.min(cols - newColSpan + 1, startCol + deltaX));
					item.colSpan = newColSpan;
					item.rowSpan = Math.max(1, startRowSpan + deltaY);
					break;
				}
				case 'ne': {
					const ic = ensureNumberValue(item.col);
					const newRowSpan = Math.max(1, startRowSpan - deltaY);
					item.row = Math.max(1, startRow + deltaY);
					item.rowSpan = newRowSpan;
					item.colSpan = Math.max(1, Math.min(cols - ic + 1, startColSpan + deltaX));
					break;
				}
				case 'nw': {
					const newColSpan = Math.max(1, startColSpan - deltaX);
					const newRowSpan = Math.max(1, startRowSpan - deltaY);
					item.col = Math.max(1, Math.min(cols - newColSpan + 1, startCol + deltaX));
					item.colSpan = newColSpan;
					item.row = Math.max(1, startRow + deltaY);
					item.rowSpan = newRowSpan;
					break;
				}
			}
		}
	}

	function stopDragResize() {
		cancelTouchHold();
		touchDragReady = false;
		if (isDragging) {
			const card = document.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
			if (card) card.style.zIndex = originalZIndex;
			const hoverCard = findCardAtPosition(
				ensureNumberValue(item.col),
				ensureNumberValue(item.row)
			);
			if (hoverCard && onSwap) {
				onSwap(item, hoverCard);
			}
		}
		isDragging = false;
		isResizing = false;
		resizeHandle = null;
		window.removeEventListener('mousemove', handlePointerMove);
		window.removeEventListener('mouseup', stopDragResize);
		window.removeEventListener('touchmove', handlePointerMove);
		window.removeEventListener('touchend', stopDragResize);
	}

	function handleDelete(e: MouseEvent | TouchEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (onDelete) onDelete(item.id);
	}

	function handleTap(e: TouchEvent) {
		// Toggle selection on tap for mobile (shows delete button)
		if (isDragging || isResizing || touchDragReady) return;
		cancelTouchHold();
		isSelected = !isSelected;
	}

	function handleDoubleClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (item.contentType === 'circle') return;
		isEditing = true;
		editText = item.content ?? '';
	}

	function finishEdit() {
		if (!isEditing) return;
		item.content = editText;
		item._startInEditMode = false;
		isEditing = false;
		if (onUpdateItem) onUpdateItem(item);
	}

	function handleEditKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			finishEdit();
		}
		if (e.key === 'Escape') {
			isEditing = false;
		}
	}

	// Deselect when clicking/tapping outside (edit mode is handled by onblur)
	function handleGlobalClick(e: MouseEvent | TouchEvent) {
		const card = document.querySelector(`[data-id="${item.id}"]`);
		if (!card) return;
		const clickedInside = card.contains(e.target as Node);
		if (!clickedInside) {
			isSelected = false;
		}
	}

	$effect(() => {
		document.addEventListener('mousedown', handleGlobalClick);
		document.addEventListener('touchstart', handleGlobalClick);
		return () => {
			window.removeEventListener('mousemove', handlePointerMove);
			window.removeEventListener('mouseup', stopDragResize);
			window.removeEventListener('touchmove', handlePointerMove);
			window.removeEventListener('touchend', stopDragResize);
			document.removeEventListener('mousedown', handleGlobalClick);
			document.removeEventListener('touchstart', handleGlobalClick);
		};
	});

	let hasStartedInEditMode = false;
	$effect(() => {
		if (startInEditMode && !hasStartedInEditMode && item.contentType !== 'circle') {
			hasStartedInEditMode = true;
			isEditing = true;
			editText = item.content ?? '';
		}
	});

	function focusElement(node: HTMLElement) {
		tick().then(() => node.focus());
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-id={item.id}
	role="gridcell"
	tabindex="0"
	aria-label={`Bento card ${item.id}: ${item.content ?? 'empty'}`}
	class="card-item group relative z-10 flex h-full w-full overflow-hidden border-2 bg-neutral-900 transition-all duration-200 rounded-{cornerRadius} {item.contentType ===
	'note'
		? 'items-start justify-start'
		: 'items-center justify-center'} {isDragging
		? 'border-avocado-400 cursor-grabbing border-dashed opacity-75'
		: 'cursor-grab'} {isResizing ? 'opacity-75' : ''} {isSelected
		? 'border-avocado-500'
		: 'hover:border-avocado-500/50 border-transparent'}"
	style="grid-column: {ensureNumberValue(item.col)} / span {ensureNumberValue(
		item.colSpan
	)}; grid-row: {ensureNumberValue(item.row)} / span {ensureNumberValue(item.rowSpan)};"
	onmousedown={startDrag}
	ontouchstart={startDrag}
	ontouchend={handleTap}
	ondblclick={handleDoubleClick}
>
	<!-- Content rendering based on type -->
	{#if isEditing}
		{#if item.contentType === 'paragraph'}
			<textarea
				class="card-text h-full w-full resize-none bg-transparent p-6 text-sm leading-relaxed text-neutral-300 outline-none"
				bind:value={editText}
				onblur={finishEdit}
				onkeydown={handleEditKeydown}
				use:focusElement
			></textarea>
		{:else if item.contentType === 'note'}
			<textarea
				class="card-text h-full w-full resize-none bg-transparent p-3 text-base text-neutral-300 outline-none"
				bind:value={editText}
				onblur={finishEdit}
				onkeydown={handleEditKeydown}
				use:focusElement
			></textarea>
		{:else}
			<input
				type="text"
				class="card-text w-full bg-transparent text-center text-3xl font-bold text-white outline-none md:text-5xl"
				bind:value={editText}
				onblur={finishEdit}
				onkeydown={handleEditKeydown}
				use:focusElement
			/>
		{/if}
	{:else if item.contentType === 'paragraph'}
		<p class="card-text p-6 text-sm leading-relaxed text-neutral-300">{item.content}</p>
	{:else if item.contentType === 'circle'}
		<div class="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
			{#each Array(4) as _, i (i)}
				<div class="circle-shape aspect-square w-16 rounded-full bg-white"></div>
			{/each}
		</div>
	{:else if item.contentType === 'typography'}
		<div class="card-text flex flex-col items-start justify-center gap-1 p-6 text-white">
			<span class="text-4xl font-bold">{item.content}</span>
			<span class="text-xs tracking-wider opacity-60">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
			<span class="text-xs tracking-wider opacity-60">abcdefghijklmnopqrstuvwxyz</span>
			<span class="text-xs tracking-wider opacity-60">123456789</span>
		</div>
	{:else if item.contentType === 'heading'}
		<span class="card-text text-3xl font-bold text-white md:text-5xl">{item.content ?? ''}</span>
	{:else if item.contentType === 'note'}
		<p
			class="card-text self-start justify-self-start p-3 text-base {item.content
				? 'text-neutral-300'
				: 'text-neutral-500'}"
		>
			{item.content || 'Type something...'}
		</p>
	{:else}
		<span class="card-text text-2xl text-white">{item.content ?? ''}</span>
	{/if}

	<!-- Delete button (visible on hover OR when selected on mobile) -->
	{#if !isEditing}
		<button
			class="absolute top-2 right-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600 {isSelected
				? '!opacity-100'
				: ''}"
			onclick={handleDelete}
			ontouchend={handleDelete}
			aria-label="Delete card"
		>
			<X class="h-3.5 w-3.5" />
		</button>
	{/if}

	<!-- Resize handles with visible indicators on hover/select -->
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-right"
		class="absolute right-0 bottom-0 z-20 h-8 w-8 cursor-se-resize md:h-5 md:w-5"
		onmousedown={(e) => startResize(e, 'se')}
		ontouchstart={(e) => startResize(e, 'se')}
	>
		<div
			class="border-avocado-500 absolute right-1 bottom-1 h-3 w-3 border-r-2 border-b-2 opacity-0 transition-opacity group-hover:opacity-80 {isSelected
				? '!opacity-100'
				: ''} rounded-br-sm"
		></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-left"
		class="absolute bottom-0 left-0 z-20 h-8 w-8 cursor-sw-resize md:h-5 md:w-5"
		onmousedown={(e) => startResize(e, 'sw')}
		ontouchstart={(e) => startResize(e, 'sw')}
	>
		<div
			class="border-avocado-500 absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 opacity-0 transition-opacity group-hover:opacity-80 {isSelected
				? '!opacity-100'
				: ''} rounded-bl-sm"
		></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-right"
		class="absolute top-0 right-0 z-20 h-8 w-8 cursor-ne-resize md:h-5 md:w-5"
		onmousedown={(e) => startResize(e, 'ne')}
		ontouchstart={(e) => startResize(e, 'ne')}
	>
		<div
			class="border-avocado-500 absolute top-1 right-1 h-3 w-3 border-t-2 border-r-2 opacity-0 transition-opacity group-hover:opacity-80 {isSelected
				? '!opacity-100'
				: ''} rounded-tr-sm"
		></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-left"
		class="absolute top-0 left-0 z-20 h-8 w-8 cursor-nw-resize md:h-5 md:w-5"
		onmousedown={(e) => startResize(e, 'nw')}
		ontouchstart={(e) => startResize(e, 'nw')}
	>
		<div
			class="border-avocado-500 absolute top-1 left-1 h-3 w-3 border-t-2 border-l-2 opacity-0 transition-opacity group-hover:opacity-80 {isSelected
				? '!opacity-100'
				: ''} rounded-tl-sm"
		></div>
	</div>
</div>
