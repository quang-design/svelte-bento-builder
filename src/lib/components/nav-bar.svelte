<script lang="ts">
	import { MonitorCog, Moon, Sun, Plus } from '@lucide/svelte';

	import type { CornerRadius, Gap } from '$lib/types/bento';

	interface Props {
		cols?: number;
		rows?: number;
		cornerRadius?: CornerRadius;
		gap?: Gap;
		showGridLines?: boolean;
		onAddCard?: () => void;
	}

	let {
		cols = $bindable(12),
		rows = $bindable(6),
		cornerRadius = $bindable('lg'),
		gap = $bindable(4),
		showGridLines = $bindable(true),
		onAddCard = undefined
	}: Props = $props();

	const cornerOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'xs', label: 'XS' },
		{ value: 'sm', label: 'SM' },
		{ value: 'md', label: 'MD' },
		{ value: 'lg', label: 'LG' },
		{ value: 'xl', label: 'XL' },
		{ value: '2xl', label: '2XL' },
		{ value: '3xl', label: '3XL' },
		{ value: '4xl', label: '4XL' },
		{ value: 'full', label: 'FULL' }
	];

	let theme = $state<'system' | 'light' | 'dark'>('system');

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
		<!-- Add Card Button -->
		<button
			class="bg-avocado-500 hover:bg-avocado-400 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-black transition-colors"
			onclick={() => onAddCard?.()}
			aria-label="Add new card"
		>
			<Plus class="h-4 w-4" />
			<span>Add</span>
		</button>

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
		<!-- Corner Radius -->
		<label for="corner-radius-select" class="ml-6 text-sm text-neutral-300">Corner</label>
		<select
			id="corner-radius-select"
			bind:value={cornerRadius}
			class="rounded-md bg-neutral-800 px-2 py-1 font-mono text-neutral-200"
		>
			{#each cornerOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
		<!-- Gap -->
		<label for="gap-select" class="ml-6 text-sm text-neutral-300">Gap</label>
		<select
			id="gap-select"
			bind:value={gap}
			class="rounded-md bg-neutral-800 px-2 py-1 font-mono text-neutral-200"
		>
			{#each Array(9)
				.fill(0)
				.map((_, i) => i) as n}
				<option value={n}>{n === 0 ? '0' : n}</option>
			{/each}
		</select>
	</div>

	<!-- Theme -->
	<div class="flex items-center gap-2">
		<!-- Grid Lines Toggle -->
		<label
			class="ml-6 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors"
			style={`background-color: ${showGridLines ? 'var(--color-avocado-500, #a4e366)' : 'rgb(38 38 38 / 1)'}; color: ${showGridLines ? 'black' : '#f4f4f5'};`}
		>
			<input type="checkbox" bind:checked={showGridLines} class="peer sr-only" />
			<span>{showGridLines ? 'Grid On' : 'Grid Off'}</span>
		</label>

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
