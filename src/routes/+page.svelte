<script lang="ts">
	import NavBar from '$lib/components/nav-bar.svelte';

	let cols = $state(12);
	let rows = $state(6);
	let cornerRadius = $state(12);
	let theme = $state<'system' | 'light' | 'dark'>('system');
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
		}
	]);

	$effect(() => {
		if (theme === 'system') {
			document.documentElement.classList.remove('light', 'dark');
		} else {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			document.documentElement.classList.toggle('light', theme === 'light');
		}
	});

	function setTheme(t: typeof theme) {
		theme = t;
	}
</script>

<main class="flex min-h-screen flex-col bg-neutral-950 transition-colors duration-300">
	<section class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		<!-- Bento Grid -->
		<div class="w-full max-w-6xl">
			<!-- Col Numbers Bar on Top -->
			<div class="mb-2 flex w-full select-none">
				<div class="w-[2.5rem]"></div>
				{#each Array(cols) as _, i}
					<div
						class="flex h-8 flex-1 items-center justify-center font-mono text-xs text-neutral-500"
					>
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
					class="relative grid flex-1 gap-4 transition-all duration-300"
					style={`grid-template-columns: repeat(${cols}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr)); min-height: 360px;`}
				>
					{#each gridItems as item (item.id)}
						<div
							class={`font-display flex items-center justify-center text-4xl font-medium ${item.color} ${item.text} transition-all`}
							style={`grid-column: ${item.col} / span ${item.colSpan}; grid-row: ${item.row} / span ${item.rowSpan}; border-radius: ${cornerRadius}px; min-height: 80px;`}
						>
							{item.content}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
	<!-- Bottom Nav Bar -->
	<NavBar bind:cols bind:rows bind:cornerRadius bind:theme {setTheme} />
</main>

<style>
	:global(html) {
		font-family: var(--font-display);
	}
</style>
