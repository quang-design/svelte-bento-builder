<script lang="ts">
	import type { Gap } from '$lib/types/bento';
	type Props = {
		cols?: number;
		rows?: number;
		gap?: Gap;
	};
	let { cols = 12, rows = 6, gap = 4 }: Props = $props();
</script>

<div class="pointer-events-none absolute inset-0 z-20">
	<!-- Column Numbers Bar (Top) -->
	<div class="absolute top-0 right-0 flex h-full w-full select-none">
		{#each Array(cols) as _, i}
			<div
				class="flex h-full flex-1 items-center justify-center border-x-[0.5px] border-white/15 font-mono text-xs text-neutral-500"
			>
				<span class="absolute -top-6">{i + 1}</span>
			</div>
			{#if i < cols - 1}
				<div class="w-{gap} bg-neutral-500/5"></div>
			{/if}
		{/each}
	</div>
	<!-- Row Numbers Bar (Left) -->
	<div class="absolute top-0 bottom-0 left-0 flex h-full w-full flex-col select-none">
		{#each Array(rows) as _, i}
			<div
				class="flex flex-1 items-center justify-end border-y-[0.5px] border-white/15 pr-2 font-mono text-xs text-neutral-500"
			>
				<span class="absolute -left-6">{i + 1}</span>
			</div>
			{#if i < rows - 1}
				<div class="h-{gap} w-full bg-neutral-500/5"></div>
			{/if}
		{/each}
	</div>
</div>
