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
		gridItems = [],
		gap = 4,
		showGridLines = true
	}: Props = $props();
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
			<BentoCard {item} {cornerRadius} />
		{/each}
	</div>
</div>
