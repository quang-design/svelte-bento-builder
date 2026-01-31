<script lang="ts">
	import { Plus } from '@lucide/svelte';
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
</script>

<nav
	class="fixed bottom-0 left-0 z-50 w-full border-t border-neutral-800 bg-neutral-900/80 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3"
>
	<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
		<!-- Logo -->
		<a
			href="/"
			class="font-display text-avocado-500 hover:text-avocado-400 hidden text-lg font-bold tracking-tight transition-colors select-none sm:block"
			aria-label="WorldKit Home"
		>
			WorldKit
		</a>

		<!-- Add Card Button -->
		<button
			class="bg-avocado-500 hover:bg-avocado-400 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-black transition-colors sm:px-3 sm:text-sm"
			onclick={() => onAddCard?.()}
			aria-label="Add new card"
		>
			<Plus class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
			<span>Add</span>
		</button>

		<!-- Columns -->
		<div class="flex items-center gap-1">
			<label for="col-range" class="text-xs text-neutral-400 sm:text-sm">Col</label>
			<input
				id="col-range"
				type="number"
				min="2"
				max="24"
				bind:value={cols}
				class="border-avocado-500/25 hover:border-avocado-500 w-12 rounded border-[0.5px] bg-transparent px-1.5 py-0.5 font-mono text-xs text-neutral-200 sm:w-14 sm:px-2 sm:py-1 sm:text-sm"
			/>
		</div>

		<!-- Rows -->
		<div class="flex items-center gap-1">
			<label for="row-range" class="text-xs text-neutral-400 sm:text-sm">Row</label>
			<input
				id="row-range"
				type="number"
				min="2"
				max="12"
				bind:value={rows}
				class="border-avocado-500/25 hover:border-avocado-500 w-12 rounded border-[0.5px] bg-transparent px-1.5 py-0.5 font-mono text-xs text-neutral-200 sm:w-14 sm:px-2 sm:py-1 sm:text-sm"
			/>
		</div>

		<!-- Corner Radius -->
		<div class="flex items-center gap-1">
			<label for="corner-radius-select" class="text-xs text-neutral-400 sm:text-sm">Radius</label>
			<select
				id="corner-radius-select"
				bind:value={cornerRadius}
				class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-200 sm:px-2 sm:py-1 sm:text-sm"
			>
				{#each cornerOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<!-- Gap -->
		<div class="flex items-center gap-1">
			<label for="gap-select" class="text-xs text-neutral-400 sm:text-sm">Gap</label>
			<select
				id="gap-select"
				bind:value={gap}
				class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-200 sm:px-2 sm:py-1 sm:text-sm"
			>
				{#each Array(9).fill(0).map((_, i) => i) as n}
					<option value={n}>{n}</option>
				{/each}
			</select>
		</div>

		<!-- Grid Lines Toggle -->
		<label
			class="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors sm:px-3 sm:py-1 sm:text-sm"
			style="background-color: {showGridLines ? 'var(--color-avocado-500, #a4e366)' : 'rgb(38 38 38)'}; color: {showGridLines ? 'black' : '#f4f4f5'};"
		>
			<input type="checkbox" bind:checked={showGridLines} class="sr-only" />
			<span>{showGridLines ? 'Grid On' : 'Grid Off'}</span>
		</label>

		<!-- Theme (single select) -->
		<div class="flex items-center gap-1">
			<label for="theme-select" class="text-xs text-neutral-400 sm:text-sm">Theme</label>
			<select
				id="theme-select"
				bind:value={theme}
				class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-200 sm:px-2 sm:py-1 sm:text-sm"
			>
				<option value="system">System</option>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	</div>
</nav>
