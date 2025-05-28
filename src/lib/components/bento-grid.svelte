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
	};

	let {
		cols = 12,
		rows = 6,
		cornerRadius = 'md',
		gridItems = $bindable([]),
		gap = 4,
		showGridLines = true
	}: Props = $props();

	// Handle swapping of two cards
	function handleSwap(item1: GridItem, item2: GridItem) {
		// Store the positions
		const tempCol = item1.col;
		const tempRow = item1.row;
		const tempColSpan = item1.colSpan;
		const tempRowSpan = item1.rowSpan;

		// Swap positions
		item1.col = item2.col;
		item1.row = item2.row;
		item1.colSpan = item2.colSpan;
		item1.rowSpan = item2.rowSpan;

		item2.col = tempCol;
		item2.row = tempRow;
		item2.colSpan = tempColSpan;
		item2.rowSpan = tempRowSpan;

		// Update the grid items array to trigger reactivity
		gridItems = [...gridItems];
	}
</script>

<div class="relative flex h-full w-full max-w-6xl">
	{#if showGridLines}
		<BentoGridLines {cols} {rows} {gap} />
	{/if}
	<div
		class="grid min-h-80 w-full gap-2"
		style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); grid-template-rows: repeat({rows}, minmax(0, 1fr));"
	>
		{#each gridItems as item (item.id)}
			<BentoCard {item} {cornerRadius} {cols} {rows} {gridItems} onSwap={handleSwap} />
		{/each}
	</div>
</div>
