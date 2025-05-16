<script lang="ts">
	import NavBar from '$lib/components/nav-bar.svelte';
	import BentoGrid from '$lib/components/bento-grid.svelte';
	import type { CornerRadius, Gap } from '$lib/types/bento';

	let cols = $state(12);
	let rows = $state(6);
	let cornerRadius = $state<CornerRadius>('lg');
	let gap = $state<Gap>(4);
	let showGridLines = $state<boolean>(false);

	let gridItems = $state([
		{
			id: 1,
			content: 'Bento',
			col: 1,
			row: 1,
			colSpan: 6,
			rowSpan: 3,
			color: 'bg-neutral-900',
			text: 'text-white'
		},
		{
			id: 2,
			content: '123',
			col: 7,
			row: 1,
			colSpan: 3,
			rowSpan: 2,
			color: 'bg-neutral-800',
			text: 'text-white'
		},
		{
			id: 3,
			content: 'AaBbCc',
			col: 10,
			row: 1,
			colSpan: 3,
			rowSpan: 2,
			color: 'bg-neutral-700',
			text: 'text-white'
		},
		{
			id: 4,
			content: '16:9',
			col: 7,
			row: 3,
			colSpan: 3,
			rowSpan: 1,
			color: 'bg-neutral-600',
			text: 'text-white'
		},
		{
			id: 5,
			content: 'Rounded corners',
			col: 10,
			row: 3,
			colSpan: 3,
			rowSpan: 1,
			color: 'bg-neutral-500',
			text: 'text-white'
		},
		{
			id: 6,
			content: 'Full width',
			col: 1,
			row: 4,
			colSpan: 12,
			rowSpan: 2,
			color: 'bg-neutral-400',
			text: 'text-white'
		}
	]);
</script>

<main class="flex min-h-screen flex-col bg-neutral-950 transition-colors duration-300">
	<section class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		<!-- Bento Grid -->
		<BentoGrid {cols} {rows} {cornerRadius} {gridItems} {gap} {showGridLines} />
	</section>
</main>

<!-- Bottom Nav Bar -->
<NavBar bind:cols bind:rows bind:cornerRadius bind:gap bind:showGridLines />

<style>
	:global(html) {
		font-family: var(--font-display);
	}
</style>
