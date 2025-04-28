<script lang="ts">
	import { MonitorCog, Moon, Sun } from '@lucide/svelte';

	let {
		cols = $bindable(),
		rows = $bindable(),
		cornerRadius = $bindable(),
		theme = $bindable(),
		setTheme = $bindable()
	} = $props();
</script>

<nav
	class="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-neutral-800 bg-neutral-900/80 px-4 py-3 backdrop-blur-md"
>
	<!-- Logo -->
	<a
		href="/"
		class="font-display text-avocado-500 hover:text-avocado-400 mr-8 flex items-center gap-2 text-lg font-bold tracking-tight transition-colors select-none"
		aria-label="WorldKit Home"
	>
		<span class="drop-shadow-sm">WorldKit</span>
	</a>
	<!-- Bento Grid Settings -->
	<div class="flex items-center gap-4">
		<!-- Columns -->
		<label for="col-range" class="text-sm text-neutral-300">Columns</label>
		<input
			id="col-range"
			type="number"
			min="2"
			max="24"
			bind:value={cols}
			class="accent-avocado-500 border-avocado-500/25 hover:border-avocado-500 rounded-md border-[0.5px] px-2 py-1 font-mono text-neutral-200"
		/>
		<!-- <span class="w-6 text-center font-mono text-neutral-200">{cols}</span> -->

		<!-- Rows -->
		<label for="row-range" class="ml-6 text-sm text-neutral-300">Rows</label>
		<input
			id="row-range"
			type="number"
			min="2"
			max="12"
			bind:value={rows}
			class="accent-avocado-500 border-avocado-500/25 hover:border-avocado-500 rounded-md border-[0.5px] px-2 py-1 font-mono text-neutral-200"
		/>
		<!-- <span class="w-6 text-center font-mono text-neutral-200">{rows}</span> -->

		<!-- Corner Radius -->
		<div class="group relative">
			<span
				class="border-avocado-500/25 hover:border-avocado-500 rounded-md border-[0.5px] px-2 py-2 text-sm text-neutral-300"
			>
				Corner
				<span class="font-mono text-neutral-200">
					{cornerRadius}px
				</span>
				<div
					class="border-avocado-500/25 absolute bottom-full left-1/2 z-10 mb-12 hidden -translate-x-1/2 -rotate-90 flex-col rounded-md border bg-neutral-800/50 p-3 shadow-lg group-hover:flex"
				>
					<input
						type="range"
						min="2"
						max="48"
						bind:value={cornerRadius}
						class="accent-avocado-500 w-24"
					/>
				</div>
			</span>
		</div>
	</div>

	<!-- Theme -->
	<div class="flex items-center gap-2">
		<button
			class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'system' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
			onclick={() => setTheme('system')}
		>
			<MonitorCog class="h-5 w-5" />
		</button>
		<button
			class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'light' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
			onclick={() => setTheme('light')}
		>
			<Sun class="h-5 w-5" />
		</button>
		<button
			class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-avocado-500 text-black' : 'bg-neutral-800 text-neutral-100'}`}
			onclick={() => setTheme('dark')}
		>
			<Moon class="h-5 w-5" />
		</button>
	</div>
</nav>
