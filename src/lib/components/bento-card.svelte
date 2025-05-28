<script lang="ts">
	import type { GridItem, CornerRadius } from '$lib/types/bento';

	type Props = {
		item: GridItem;
		cornerRadius?: CornerRadius;
		cols?: number;
		rows?: number;
		gridItems?: GridItem[];
		onSwap?: (item1: GridItem, item2: GridItem) => void;
	};

	let {
		item = $bindable(),
		cornerRadius = 'md',
		cols = 12,
		rows = 6,
		gridItems = [],
		onSwap = undefined
	}: Props = $props();

	// Initialize item properties if undefined
	item.col = item.col ?? 1;
	item.row = item.row ?? 1;
	item.colSpan = item.colSpan ?? 1;
	item.rowSpan = item.rowSpan ?? 1;

	let isDragging = $state(false);
	let isResizing = $state(false);
	let resizeHandle = $state<null | 'se' | 'sw' | 'ne' | 'nw'>(null);
	let startX = $state(0);
	let startY = $state(0);
	let startCol = $state(0);
	let startRow = $state(0);
	let startColSpan = $state(0);
	let startRowSpan = $state(0);
	let originalZIndex = $state<string>('');

	// Get the grid cell size dynamically
	function getCellSize() {
		// We need to find the grid container; it might be the .grid class or we can try the parent of this card
		const gridContainer =
			document.querySelector('.grid') || document.querySelector('[style*="grid-template-columns"]');

		if (!gridContainer) return { cellWidth: 0, cellHeight: 0 };

		const gridWidth = gridContainer.clientWidth;
		const gridHeight = gridContainer.clientHeight;

		const cellWidth = gridWidth / cols;
		const cellHeight = gridHeight / rows;

		return { cellWidth, cellHeight };
	}

	// Helper function to make sure we have numerical values for all grid properties
	function ensureNumberValue(value: number | undefined): number {
		return typeof value === 'number' ? value : 1;
	}

	// Find a card at a specific grid position
	function findCardAtPosition(col: number, row: number): GridItem | undefined {
		return gridItems.find((gridItem) => {
			if (gridItem.id === item.id) return false; // Skip the current card

			const itemCol = ensureNumberValue(gridItem.col);
			const itemRow = ensureNumberValue(gridItem.row);
			const itemColSpan = ensureNumberValue(gridItem.colSpan);
			const itemRowSpan = ensureNumberValue(gridItem.rowSpan);

			// Check if the position is within the card's area
			const isInCol = col >= itemCol && col < itemCol + itemColSpan;
			const isInRow = row >= itemRow && row < itemRow + itemRowSpan;

			return isInCol && isInRow;
		});
	}

	// Handle mouse down for dragging
	function startDrag(e: MouseEvent) {
		// Don't start drag if clicking on a resize handle
		if (resizeHandle) return;

		e.preventDefault();
		isDragging = true;

		// Store the original z-index
		const card = e.currentTarget as HTMLElement;
		originalZIndex = card.style.zIndex || '10';
		// Bring the card to the front while dragging
		card.style.zIndex = '100';

		// Store initial position as confirmed numbers
		startX = e.clientX;
		startY = e.clientY;
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);

		// Add global event listeners
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', stopDragResize);
	}

	// Handle mouse down for resizing
	function startResize(e: MouseEvent, handle: 'se' | 'sw' | 'ne' | 'nw') {
		e.preventDefault();
		e.stopPropagation();
		isResizing = true;
		resizeHandle = handle;

		// Store initial values as confirmed numbers
		startX = e.clientX;
		startY = e.clientY;
		startColSpan = ensureNumberValue(item.colSpan);
		startRowSpan = ensureNumberValue(item.rowSpan);
		startCol = ensureNumberValue(item.col);
		startRow = ensureNumberValue(item.row);

		// Add global event listeners
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', stopDragResize);
	}

	// Handle mouse move for both dragging and resizing
	function handleMouseMove(e: MouseEvent) {
		const { cellWidth, cellHeight } = getCellSize();
		if (cellWidth === 0 || cellHeight === 0) return;

		const deltaX = Math.round((e.clientX - startX) / cellWidth);
		const deltaY = Math.round((e.clientY - startY) / cellHeight);

		if (isDragging) {
			// Update position ensuring we don't go out of bounds
			const itemColSpan = ensureNumberValue(item.colSpan);
			const itemRowSpan = ensureNumberValue(item.rowSpan);
			const newCol = Math.max(1, Math.min(cols - itemColSpan + 1, startCol + deltaX));
			const newRow = Math.max(1, Math.min(rows - itemRowSpan + 1, startRow + deltaY));

			// Check if we're hovering over another card
			const hoverCard = findCardAtPosition(newCol, newRow);

			item.col = newCol;
			item.row = newRow;
		} else if (isResizing) {
			switch (resizeHandle) {
				case 'se': // Southeast (bottom-right)
					const itemColSE = ensureNumberValue(item.col);
					const itemRowSE = ensureNumberValue(item.row);
					const newColSpanSE = Math.max(1, Math.min(cols - itemColSE + 1, startColSpan + deltaX));
					const newRowSpanSE = Math.max(1, Math.min(rows - itemRowSE + 1, startRowSpan + deltaY));
					item.colSpan = newColSpanSE;
					item.rowSpan = newRowSpanSE;
					break;

				case 'sw': // Southwest (bottom-left)
					// For SW, as we move left, we decrease the column and increase the span
					const itemRowSW = ensureNumberValue(item.row);
					const newColSpanSW = Math.max(1, startColSpan - deltaX);
					const newColSW = Math.max(1, Math.min(cols - newColSpanSW + 1, startCol + deltaX));
					const newRowSpanSW = Math.max(1, Math.min(rows - itemRowSW + 1, startRowSpan + deltaY));

					item.col = newColSW;
					item.colSpan = newColSpanSW;
					item.rowSpan = newRowSpanSW;
					break;

				case 'ne': // Northeast (top-right)
					// For NE, as we move up, we decrease the row and increase the span
					const itemColNE = ensureNumberValue(item.col);
					const newRowSpanNE = Math.max(1, startRowSpan - deltaY);
					const newRowNE = Math.max(1, Math.min(rows - newRowSpanNE + 1, startRow + deltaY));
					const newColSpanNE = Math.max(1, Math.min(cols - itemColNE + 1, startColSpan + deltaX));

					item.row = newRowNE;
					item.rowSpan = newRowSpanNE;
					item.colSpan = newColSpanNE;
					break;

				case 'nw': // Northwest (top-left)
					// For NW, we adjust both col and row
					const newColSpanNW = Math.max(1, startColSpan - deltaX);
					const newColNW = Math.max(1, Math.min(cols - newColSpanNW + 1, startCol + deltaX));
					const newRowSpanNW = Math.max(1, startRowSpan - deltaY);
					const newRowNW = Math.max(1, Math.min(rows - newRowSpanNW + 1, startRow + deltaY));

					item.col = newColNW;
					item.colSpan = newColSpanNW;
					item.row = newRowNW;
					item.rowSpan = newRowSpanNW;
					break;
			}
		}
	}

	// Stop dragging and resizing
	function stopDragResize(e: MouseEvent) {
		if (isDragging) {
			// Restore the original z-index
			const card = document.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
			if (card) card.style.zIndex = originalZIndex;

			// Check if we're hovering over another card to swap
			const hoverCard = findCardAtPosition(
				ensureNumberValue(item.col),
				ensureNumberValue(item.row)
			);
			if (hoverCard && onSwap) {
				// Swap the positions of the two cards
				const tempCol = item.col;
				const tempRow = item.row;

				// If we have a callback, use it
				onSwap(item, hoverCard);
			}
		}

		isDragging = false;
		isResizing = false;
		resizeHandle = null;

		// Remove global event listeners
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', stopDragResize);
	}

	// Cleanup event listeners when the component is destroyed
	$effect(() => {
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', stopDragResize);
		};
	});
</script>

<div
	data-id={item.id}
	role="gridcell"
	tabindex="0"
	aria-label={`Bento card ${item.id}: ${item.content ?? 'empty'}`}
	class="hover:border-avocado-500 relative z-10 flex h-full min-h-24 w-full cursor-move items-center justify-center border transition-all duration-200 {item.color ??
		''} rounded-{cornerRadius} {isDragging ? 'border-2 border-dashed opacity-75' : ''} {isResizing
		? 'opacity-75'
		: ''}"
	style={`grid-column: ${ensureNumberValue(item.col)} / span ${ensureNumberValue(item.colSpan)}; grid-row: ${ensureNumberValue(item.row)} / span ${ensureNumberValue(item.rowSpan)}; min-height: 80px;`}
	onmousedown={startDrag}
>
	<span class="text-2xl text-white">{item.content ?? ''}</span>

	<!-- Resize handles with visual indicators -->
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-right"
		class="hover:bg-avocado-500/50 absolute right-0 bottom-0 h-5 w-5 cursor-se-resize rounded-sm bg-white/20"
		onmousedown={(e) => startResize(e, 'se')}
	>
		<div class="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from bottom-left"
		class="hover:bg-avocado-500/50 absolute bottom-0 left-0 h-5 w-5 cursor-sw-resize rounded-sm bg-white/20"
		onmousedown={(e) => startResize(e, 'sw')}
	>
		<div class="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-right"
		class="hover:bg-avocado-500/50 absolute top-0 right-0 h-5 w-5 cursor-ne-resize rounded-sm bg-white/20"
		onmousedown={(e) => startResize(e, 'ne')}
	>
		<div class="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/50"></div>
	</div>
	<div
		role="button"
		tabindex="0"
		aria-label="Resize from top-left"
		class="hover:bg-avocado-500/50 absolute top-0 left-0 h-5 w-5 cursor-nw-resize rounded-sm bg-white/20"
		onmousedown={(e) => startResize(e, 'nw')}
	>
		<div class="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/50"></div>
	</div>
</div>
