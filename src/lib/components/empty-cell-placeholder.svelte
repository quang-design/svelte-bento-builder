<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import type { CornerRadius } from '$lib/types/bento';

	type Props = {
		col: number;
		row: number;
		cornerRadius?: CornerRadius;
		isInSelection?: boolean;
		onDragStart?: (col: number, row: number) => void;
		onDragEnter?: (col: number, row: number) => void;
		onDragEnd?: () => void;
	};

	let {
		col,
		row,
		cornerRadius = 'md',
		isInSelection = false,
		onDragStart = undefined,
		onDragEnter = undefined,
		onDragEnd = undefined
	}: Props = $props();

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		if (onDragStart) onDragStart(col, row);
	}

	function handleMouseEnter() {
		if (onDragEnter) onDragEnter(col, row);
	}

	function handleMouseUp() {
		if (onDragEnd) onDragEnd();
	}
</script>

<div
	role="button"
	tabindex="0"
	class="group/empty flex h-full w-full items-start justify-start rounded-{cornerRadius} border-2 border-dashed p-3 transition-all duration-200 {isInSelection
		? 'border-avocado-500 bg-avocado-500/20 opacity-100'
		: 'border-neutral-700 bg-neutral-800/30 opacity-0 hover:border-neutral-500 hover:bg-neutral-800/50 hover:opacity-100'}"
	style="grid-column: {col} / span 1; grid-row: {row} / span 1;"
	onmousedown={handleMouseDown}
	onmouseenter={handleMouseEnter}
	onmouseup={handleMouseUp}
	aria-label="Add new card"
>
	<Plus class="h-5 w-5 text-neutral-500 transition-colors group-hover/empty:text-neutral-400" />
</div>

<style>
	:global(html.light) div[role='button'] {
		border-color: #d4d4d4 !important;
		background-color: rgba(245, 245, 245, 0.3) !important;
	}
	:global(html.light) div[role='button']:hover {
		border-color: #a3a3a3 !important;
		background-color: rgba(245, 245, 245, 0.5) !important;
	}
</style>
