<script lang="ts">
	import BentoCard from '$lib/components/bento-card.svelte';
	import BentoGridLines from '$lib/components/bento-grid-lines.svelte';
	import EmptyCellPlaceholder from '$lib/components/empty-cell-placeholder.svelte';
	import type { GridItem, CornerRadius, Gap } from '$lib/types/bento';

	type Props = {
		cols?: number;
		rows?: number;
		cornerRadius?: CornerRadius;
		gridItems?: GridItem[];
		gap?: Gap;
		showGridLines?: boolean;
		onDelete?: (id: number) => void;
		onUpdateItem?: (item: GridItem) => void;
		onAddCard?: (col: number, row: number, colSpan: number, rowSpan: number) => void;
	};

	let {
		cols = 12,
		rows = 6,
		cornerRadius = 'md',
		gridItems = $bindable([]),
		gap = 4,
		showGridLines = true,
		onDelete = undefined,
		onUpdateItem = undefined,
		onAddCard = undefined
	}: Props = $props();

	function isCellOccupied(col: number, row: number): boolean {
		return gridItems.some((item) => {
			const ic = item.col ?? 1;
			const ir = item.row ?? 1;
			const ics = item.colSpan ?? 1;
			const irs = item.rowSpan ?? 1;
			return col >= ic && col < ic + ics && row >= ir && row < ir + irs;
		});
	}

	function getEmptyCells(): { col: number; row: number }[] {
		const empty: { col: number; row: number }[] = [];
		for (let r = 1; r <= rows; r++) {
			for (let c = 1; c <= cols; c++) {
				if (!isCellOccupied(c, r)) {
					empty.push({ col: c, row: r });
				}
			}
		}
		return empty;
	}

	let isDragging = $state(false);
	let dragStart = $state<{ col: number; row: number } | null>(null);
	let dragEnd = $state<{ col: number; row: number } | null>(null);

	function getSelectionBounds() {
		if (!dragStart || !dragEnd) return null;
		const minCol = Math.min(dragStart.col, dragEnd.col);
		const maxCol = Math.max(dragStart.col, dragEnd.col);
		const minRow = Math.min(dragStart.row, dragEnd.row);
		const maxRow = Math.max(dragStart.row, dragEnd.row);
		return { minCol, maxCol, minRow, maxRow };
	}

	function isCellInSelection(col: number, row: number): boolean {
		if (!isDragging) return false;
		const bounds = getSelectionBounds();
		if (!bounds) return false;
		return (
			col >= bounds.minCol && col <= bounds.maxCol && row >= bounds.minRow && row <= bounds.maxRow
		);
	}

	function handleDragStart(col: number, row: number) {
		isDragging = true;
		dragStart = { col, row };
		dragEnd = { col, row };
	}

	function handleDragEnter(col: number, row: number) {
		if (isDragging) {
			dragEnd = { col, row };
		}
	}

	function handleDragEnd() {
		if (isDragging && dragStart && dragEnd && onAddCard) {
			const bounds = getSelectionBounds()!;
			const colSpan = bounds.maxCol - bounds.minCol + 1;
			const rowSpan = bounds.maxRow - bounds.minRow + 1;
			onAddCard(bounds.minCol, bounds.minRow, colSpan, rowSpan);
		}
		isDragging = false;
		dragStart = null;
		dragEnd = null;
	}

	function handleGlobalMouseUp() {
		if (isDragging) {
			handleDragEnd();
		}
	}

	$effect(() => {
		window.addEventListener('mouseup', handleGlobalMouseUp);
		return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
	});

	function handleSwap(item1: GridItem, item2: GridItem) {
		const tempCol = item1.col;
		const tempRow = item1.row;
		const tempColSpan = item1.colSpan;
		const tempRowSpan = item1.rowSpan;

		item1.col = item2.col;
		item1.row = item2.row;
		item1.colSpan = item2.colSpan;
		item1.rowSpan = item2.rowSpan;

		item2.col = tempCol;
		item2.row = tempRow;
		item2.colSpan = tempColSpan;
		item2.rowSpan = tempRowSpan;

		gridItems = [...gridItems];
	}
</script>

<div class="relative w-full max-w-6xl overflow-visible" style="aspect-ratio: {cols} / {rows};">
	{#if showGridLines}
		<BentoGridLines {cols} {rows} {gap} />
	{/if}
	<div
		data-bento-grid
		class="grid h-full w-full gap-{gap}"
		style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 1fr);"
	>
		{#each gridItems as item, i (item.id)}
			<BentoCard
				bind:item={gridItems[i]}
				{cornerRadius}
				{cols}
				{rows}
				{gridItems}
				onSwap={handleSwap}
				{onDelete}
				{onUpdateItem}
				startInEditMode={gridItems[i]._startInEditMode}
			/>
		{/each}
		{#each getEmptyCells() as cell (`${cell.col}-${cell.row}`)}
			<EmptyCellPlaceholder
				col={cell.col}
				row={cell.row}
				{cornerRadius}
				isInSelection={isCellInSelection(cell.col, cell.row)}
				onDragStart={handleDragStart}
				onDragEnter={handleDragEnter}
				onDragEnd={handleDragEnd}
			/>
		{/each}
	</div>
</div>
