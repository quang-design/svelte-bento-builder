<script lang="ts">
	let { cols = 12, rows = 6, gap = 'gap-4' } = $props();

	// $derived ensures gapPx updates when gap changes
	const gapPx = $derived.by(() => {
		if (gap.startsWith('gap-')) {
			const match = gap.match(/gap-(\d+)/);
			if (match) return parseInt(match[1]) * 0.25 * 16; // Tailwind gap-4 = 1rem = 16px
			if (gap === 'gap-px') return 1;
		}
		return 16; // default 1rem
	});

	const colWidth = $derived(`calc((100% - ${(cols - 1) * gapPx}px) / ${cols})`);
	const rowHeight = $derived(`calc((100% - ${(rows - 1) * gapPx}px) / ${rows})`);
</script>

<div class="pointer-events-none absolute inset-0 z-20">
	{#key cols + '-' + rows + '-' + gapPx}
		<!-- Vertical grid lines -->
		{#each Array(cols) as _, i}
			{@const col = colWidth}
			{@const start = `calc(${i} * (${col} + ${gapPx}px))`}
			{@const end = `calc(${i} * (${col} + ${gapPx}px) + ${colWidth})`}
			<div class="absolute top-0 bottom-0 w-px bg-white/20" style={`left: ${start};`}></div>
			<div class="absolute top-0 bottom-0 w-px bg-white/20" style={`left: ${end};`}></div>
		{/each}
		<!-- Horizontal grid lines -->
		{#each Array(rows) as _, j}
			{@const row = rowHeight}
			{@const start = `calc(${j} * (${row} + ${gapPx}px))`}
			{@const end = `calc(${j} * (${row} + ${gapPx}px) + ${rowHeight})`}
			<div class="absolute right-0 left-0 h-px bg-white/20" style={`top: ${start};`}></div>
			<div class="absolute right-0 left-0 h-px bg-white/20" style={`top: ${end};`}></div>
		{/each}
	{/key}
</div>
