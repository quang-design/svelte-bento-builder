<script lang="ts">
	import { onMount } from 'svelte';
	import NavBar from '$lib/components/nav-bar.svelte';
	import BentoGrid from '$lib/components/bento-grid.svelte';
	import type { CornerRadius, Gap, GridItem } from '$lib/types/bento';

	let cols = $state(12);
	let rows = $state(6);
	let cornerRadius = $state<CornerRadius>('lg');
	let gap = $state<Gap>(4);
	let showGridLines = $state<boolean>(false);

	// Responsive: clamp cols based on screen width
	function getMaxCols(width: number): number {
		if (width < 640) return 4;
		if (width < 1024) return 8;
		return 24;
	}

	onMount(() => {
		function handleResize() {
			const maxCols = getMaxCols(window.innerWidth);
			if (cols > maxCols) cols = maxCols;
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	let gridItems = $state<GridItem[]>([
		{
			id: 1,
			content: 'By exploring these success stories, individuals and organizations can identify effective techniques to emulate, pitfalls to avoid, and unique strategies that could be tailored to their own context.',
			contentType: 'paragraph',
			col: 1,
			row: 1,
			colSpan: 5,
			rowSpan: 2
		},
		{
			id: 2,
			content: '',
			contentType: 'circle',
			col: 6,
			row: 1,
			colSpan: 2,
			rowSpan: 4
		},
		{
			id: 3,
			content: 'Rounded corners',
			contentType: 'heading',
			col: 8,
			row: 1,
			colSpan: 3,
			rowSpan: 2
		},
		{
			id: 4,
			content: 'Bento',
			contentType: 'heading',
			col: 1,
			row: 3,
			colSpan: 5,
			rowSpan: 4
		},
		{
			id: 5,
			content: '16:9',
			contentType: 'heading',
			col: 11,
			row: 3,
			colSpan: 2,
			rowSpan: 2
		},
		{
			id: 6,
			content: '123',
			contentType: 'heading',
			col: 8,
			row: 5,
			colSpan: 2,
			rowSpan: 2
		},
		{
			id: 7,
			content: 'AaBbCc',
			contentType: 'typography',
			col: 10,
			row: 5,
			colSpan: 3,
			rowSpan: 2
		},
		{
			id: 8,
			content: '',
			contentType: 'text',
			col: 8,
			row: 3,
			colSpan: 3,
			rowSpan: 2
		}
	]);

	let nextId = $state(9);

	function addCard() {
		let placed = false;
		for (let r = 1; r <= rows && !placed; r++) {
			for (let c = 1; c <= cols - 1 && !placed; c++) {
				const occupied = gridItems.some((item) => {
					const ic = item.col ?? 1;
					const ir = item.row ?? 1;
					const ics = item.colSpan ?? 1;
					const irs = item.rowSpan ?? 1;
					for (let dc = 0; dc < 2; dc++) {
						if (c + dc >= ic && c + dc < ic + ics && r >= ir && r < ir + irs) return true;
					}
					return false;
				});
				if (!occupied) {
					gridItems = [
						...gridItems,
						{
							id: nextId++,
							content: 'New card',
							contentType: 'text',
							col: c,
							row: r,
							colSpan: 2,
							rowSpan: 1
						}
					];
					placed = true;
				}
			}
		}
		if (!placed) {
			rows += 1;
			gridItems = [
				...gridItems,
				{
					id: nextId++,
					content: 'New card',
					contentType: 'text',
					col: 1,
					row: rows,
					colSpan: 2,
					rowSpan: 1
				}
			];
		}
	}

	function deleteCard(id: number) {
		gridItems = gridItems.filter((item) => item.id !== id);
	}

	function updateItem(updated: GridItem) {
		gridItems = gridItems.map((item) => (item.id === updated.id ? { ...updated } : item));
	}
</script>

<main
	class="flex min-h-screen flex-col bg-neutral-950 pb-16 transition-colors duration-300 dark:bg-neutral-950"
>
	<section class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		<BentoGrid {cols} {rows} {cornerRadius} {gridItems} {gap} {showGridLines} onDelete={deleteCard} onUpdateItem={updateItem} />
	</section>
</main>

<NavBar bind:cols bind:rows bind:cornerRadius bind:gap bind:showGridLines onAddCard={addCard} />

<style>
	:global(html) {
		font-family: var(--font-display);
	}
	:global(html.light) {
		color-scheme: light;
	}
	:global(html.light main) {
		background-color: #fafafa !important;
	}
	:global(html.light .card-item) {
		background-color: #e5e5e5 !important;
		color: #171717 !important;
	}
	:global(html.light .card-item span),
	:global(html.light .card-item p),
	:global(html.light .card-item input),
	:global(html.light .card-item textarea),
	:global(html.light .card-item .card-text) {
		color: #171717 !important;
	}
	:global(html.light .card-item .circle-shape) {
		background-color: #171717 !important;
	}
	:global(html.light nav) {
		background-color: rgb(245 245 245 / 0.9) !important;
		border-color: #d4d4d4 !important;
	}
	:global(html.light nav label),
	:global(html.light nav span),
	:global(html.light nav a) {
		color: #171717 !important;
	}
	:global(html.light nav input),
	:global(html.light nav select) {
		color: #171717 !important;
		background-color: #e5e5e5 !important;
		border-color: #a3a3a3 !important;
	}
</style>
