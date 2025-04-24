<script lang="ts">
	let columns = $state(12);
	let rows = $state(6);
	let cornerRadius = $state(24);
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
		<div class="flex w-full max-w-6xl">
			<!-- Row Numbers Bar -->
			<div class="mr-2 flex flex-col select-none" style={`width: 2.5rem;`}>
				{#each Array(rows) as _, i}
					<div
						class="flex h-full items-center justify-end pr-2 font-mono text-xs text-neutral-500"
						style={`height: calc((100% - ${(rows - 1) * 1}rem) / ${rows}); min-height: 40px;`}
					>
						{i + 1}
					</div>
				{/each}
			</div>
			<!-- Bento Grid -->
			<div
				class="relative grid flex-1 gap-4 transition-all duration-300"
				style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr)); min-height: 360px;`}
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
	</section>
	<!-- Bottom Nav Bar -->
	<nav
		class="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-neutral-800 bg-neutral-900/80 px-4 py-3 backdrop-blur-md"
	>
		<div class="flex items-center gap-4">
			<label for="col-range" class="text-sm text-neutral-300">Columns</label>
			<input
				id="col-range"
				type="range"
				min="2"
				max="24"
				bind:value={columns}
				class="accent-avocado-500"
			/>
			<span class="w-6 text-center font-mono text-neutral-200">{columns}</span>
			<label for="row-range" class="ml-6 text-sm text-neutral-300">Rows</label>
			<input
				id="row-range"
				type="range"
				min="2"
				max="12"
				bind:value={rows}
				class="accent-avocado-500"
			/>
			<span class="w-6 text-center font-mono text-neutral-200">{rows}</span>
		</div>
		<div class="flex items-center gap-4">
			<label for="corner-range" class="text-sm text-neutral-300">Corner</label>
			<input
				id="corner-range"
				type="range"
				min="0"
				max="48"
				bind:value={cornerRadius}
				class="accent-avocado-500"
			/>
			<span class="w-8 text-center font-mono text-neutral-200">{cornerRadius}px</span>
		</div>
		<div class="flex items-center gap-2">
			<button
				class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'system' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
				onclick={() => setTheme('system')}>System</button
			>
			<button
				class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'light' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
				onclick={() => setTheme('light')}>Light</button
			>
			<button
				class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
				onclick={() => setTheme('dark')}>Dark</button
			>
		</div>
	</nav>
</main>

<style>
	:global(html) {
		font-family: var(--font-display);
	}
</style>
