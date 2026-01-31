<script lang="ts">
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
	};

	let {
		item = $bindable(),
		cornerRadius = 'md',
		cols = 12,
		rows = 6,
		gridItems = [],
		onSwap = undefined,
		onDelete = undefined
	}: Props = $props();

	item.col = item.col ?? 1;
	item.row = item.row ?? 1;
	item.colSpan = item.colSpan ?? 1;
	item.rowSpan = item.rowSpan ?? 1;

	let isDragging = $state(false);
	let isResizing = $state(false);
	let isHovered = $state(false);
	let resizeHandle = $state<null | 'se' | 'sw' | 'ne' | 'nw'>(null);
	let startX = $state(0);
	let startY = $state(0);
	let startCol = $state(0);
	let startRow = $state(0);
	let startColSpan = $state(0);
	let startRowSpan = $state(0);
	let originalZIndex = $state<string>('');

	function getCellSize() {
		const gridContainer =
			document.querySelector('.grid') || document.querySelector('[style*="grid-template-columns"]');
		if (!gridContainer) return { cellWidth: 0, cellHeight: 0 };
		return { cellWidth: gridContainer.clientWidth / cols, cellHeight: gridContainer.clientHeight / rows };
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
			return col >= itemCol && col < itemCol + itemColSpan && row >= itemRow && row < itemRow + itemRowSpan;
		});
	}

	function startDrag(e: MouseEvent) {
		if (resizeHandle) return;
		e.preventDefault();
		isDragging = true;
		const card = e.currentTarget as HTMLElement;
		originalZIndex = card.style.zIndex || '10';
		card.style.zIndex = '100';
		startX = e.clientX;
		startY = e.clientY;
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', stopDragResize);
	}

	function startResize(e: MouseEvent, handle: 'se' | 'sw' | 'ne' | 'nw') {
		e.preventDefault();
		e.stopPropagation();
		isResizing = true;
		resizeHandle = handle;
		startX = e.clientX;
		startY = e.clientY;
		startColSpan = ensureNumberValue(item.colSpan);
		startRowSpan = ensureNumberValue(item.rowSpan);
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', stopDragResize);
	}

	function handleMouseMove(e: MouseEvent) {
		const { cellWidth, cellHeight } = getCellSize();
		if (cellWidth === 0 || cellHeight === 0) return;
		const deltaX = Math.round((e.clientX - startX) / cellWidth);
		const deltaY = Math.round((e.clientY - startY) / cellHeight);

		if (isDragging) {
			const itemColSpan = ensureNumberValue(item.colSpan);
			const itemRowSpan = ensureNumberValue(item.rowSpan);
			item.col = Math.max(1, Math.min(cols - itemColSpan + 1, startCol + deltaX));
			item.row = Math.max(1, Math.min(rows - itemRowSpan + 1, startRow + deltaY));
		} else if (isResizing) {
			switch (resizeHandle) {
				case 'se': {
					const ic = ensureNumberValue(item.col);
					const ir = ensureNumberValue(item.row);
					item.colSpan = Math.max(1, Math.min(cols - ic + 1, startColSpan + deltaX));
					item.rowSpan = Math.max(1, Math.min(rows - ir + 1, startRowSpan + deltaY));
					break;
				}
				case 'sw': {
					const ir = ensureNumberValue(item.row);
					const newColSpan = Math.max(1, startColSpan - deltaX);
					item.col = Math.max(1, Math.min(cols - newColSpan + 1, startCol + deltaX));
					item.colSpan = newColSpan;
					item.rowSpan = Math.max(1, Math.min(rows - ir + 1, startRowSpan + deltaY));
					break;
				}
				case 'ne': {
					const ic = ensureNumberValue(item.col);
					const newRowSpan = Math.max(1, startRowSpan - deltaY);
					item.row = Math.max(1, Math.min(rows - newRowSpan + 1, startRow + deltaY));
					item.rowSpan = newRowSpan;
					item.colSpan = Math.max(1, Math.min(cols - ic + 1, startColSpan + deltaX));
					break;
				}
				case 'nw': {
					const newColSpan = Math.max(1, startColSpan - deltaX);
					const newRowSpan = Math.max(1, startRowSpan - deltaY);
					item.col = Math.max(1, Math.min(cols - newColSpan + 1, startCol + deltaX));
					item.colSpan = newColSpan;
					item.row = Math.max(1, Math.min(rows - newRowSpan + 1, startRow + deltaY));
					item.rowSpan = newRowSpan;
					break;
				}
			}
		}
	}

	function stopDragResize(e: MouseEvent) {
		if (isDragging) {
			const card = document.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
			if (card) card.style.zIndex = originalZIndex;
			const hoverCard = findCardAtPosition(ensureNumberValue(item.col), ensureNumberValue(item.row));
			if (hoverCard && onSwap) {
				onSwap(item, hoverCard);
			}
		}
		isDragging = false;
		isResizing = false;
		resizeHandle = null;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', stopDragResize);
	}

	function handleDelete(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (onDelete) onDelete(item.id);
	}

	$effect(() => {
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', stopDragResize);
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-id={item.id}
	role="gridcell"
	tabindex="0"
	aria-label={`Bento card ${item.id}: ${item.content ?? 'empty'}`}
	class="card-item group relative z-10 flex h-full min-h-24 w-full cursor-move items-center justify-center overflow-hidden border border-transparent bg-neutral-900 transition-all duration-200 hover:border-avocado-500 rounded-{cornerRadius} {isDragging ? 'border-2 border-dashed opacity-75' : ''} {isResizing ? 'opacity-75' : ''}"
	style={`grid-column: ${ensureNumberValue(item.col)} / span ${ensureNumberValue(item.colSpan)}; grid-row: ${ensureNumberValue(item.row)} / span ${ensureNumberValue(item.rowSpan)}; min-height: 80px;`}
	onmousedown={startDrag}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<!-- Content rendering based on type -->
	{#if item.contentType === 'paragraph'}
		<p class="card-text p-6 text-sm leading-relaxed text-neutral-300">{item.content}</p>
	{:else if item.contentType === 'circle'}
		<div class="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
			{#each Array(4) as _}
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
	{:else}
		<span class="card-text text-2xl text-white">{item.content ?? ''}</span>
	{/if}

	<!-- Delete button (visible on hover) -->
	<button
		class="absolute top-2 right-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
		onclick={handleDelete}
		aria-label="Delete card"
	>
		<X class="h-3.5 w-3.5" />
	</button>

	<!-- Resize handles -->
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-right"
		class="resize-handle hover:bg-avocado-500/50 absolute right-0 bottom-0 h-5 w-5 cursor-se-resize rounded-sm bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
		onmousedown={(e) => startResize(e, 'se')}
	>
		<div class="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-left"
		class="resize-handle hover:bg-avocado-500/50 absolute bottom-0 left-0 h-5 w-5 cursor-sw-resize rounded-sm bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
		onmousedown={(e) => startResize(e, 'sw')}
	>
		<div class="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-right"
		class="resize-handle hover:bg-avocado-500/50 absolute top-0 right-0 h-5 w-5 cursor-ne-resize rounded-sm bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
		onmousedown={(e) => startResize(e, 'ne')}
	>
		<div class="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-left"
		class="resize-handle hover:bg-avocado-500/50 absolute top-0 left-0 h-5 w-5 cursor-nw-resize rounded-sm bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
		onmousedown={(e) => startResize(e, 'nw')}
	>
		<div class="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/50"></div>
	</div>
</div>
