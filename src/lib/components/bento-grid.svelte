<script lang="ts">
	import BentoCard from '$lib/components/bento-card.svelte';
	import BentoGridLines from '$lib/components/bento-grid-lines.svelte';
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
	};

	let {
		cols = 12,
		rows = 6,
		cornerRadius = 'md',
		gridItems = $bindable([]),
		gap = 4,
		showGridLines = true,
		onDelete = undefined,
		onUpdateItem = undefined
	}: Props = $props();

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

<div class="relative w-full max-w-6xl" style="aspect-ratio: {cols} / {rows};">
	{#if showGridLines}
		<BentoGridLines {cols} {rows} {gap} />
	{/if}
	<div
		data-bento-grid
		class="grid h-full w-full gap-{gap}"
		style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 1fr);"
	>
		{#each gridItems as item (item.id)}
			<BentoCard {item} {cornerRadius} {cols} {rows} {gridItems} onSwap={handleSwap} {onDelete} {onUpdateItem} />
		{/each}
	</div>
</div>
