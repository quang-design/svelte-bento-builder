<script lang="ts">
	import BentoCard from './bento-card.svelte';

	let { cols = 12, rows = 6, cornerRadius = 'md', gridItems = [], gap = 'gap-4' } = $props();
</script>

<div class="w-full max-w-6xl">
	<!-- Col Numbers Bar on Top -->
	<div class="mb-2 flex w-full select-none">
		<div class="w-[2.5rem]"></div>
		{#each Array(cols) as _, i}
			<div class="flex h-8 flex-1 items-center justify-center font-mono text-xs text-neutral-500">
				{i + 1}
			</div>
		{/each}
	</div>
	<!-- Row Numbers Bar + Grid -->
	<div class="flex w-full">
		<div class="mr-2 flex w-[2.5rem] flex-col select-none">
			{#each Array(rows) as _, i}
				<div
					class="flex h-full items-center justify-end pr-2 font-mono text-xs text-neutral-500"
					style={`height: calc((100% - ${(rows - 1) * 1}rem) / ${rows}); min-height: 40px;`}
				>
					{i + 1}
				</div>
			{/each}
		</div>
		<div
			class={`relative grid flex-1 transition-all duration-300 ${gap}`}
			style={`grid-template-columns: repeat(${cols}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr)); min-height: 360px;`}
		>
			{#each gridItems as item (item.id)}
				<BentoCard
					content={item.content}
					color={item.color}
					text={item.text}
					col={item.col}
					row={item.row}
					colSpan={item.colSpan}
					rowSpan={item.rowSpan}
					{cornerRadius}
				/>
			{/each}
		</div>
	</div>
</div>
