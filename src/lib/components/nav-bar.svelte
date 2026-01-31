<script lang="ts">
	import { Plus, Settings, X } from '@lucide/svelte';
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
	let settingsOpen = $state(false);

	$effect(() => {
		if (theme === 'system') {
			document.documentElement.classList.remove('light', 'dark');
		} else {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			document.documentElement.classList.toggle('light', theme === 'light');
		}
	});
</script>

<!-- Mobile navbar: logo + add + settings trigger -->
<nav
	class="fixed bottom-0 left-0 z-50 w-full border-t border-neutral-800 bg-neutral-900/80 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3"
>
	<!-- Mobile layout -->
	<div class="flex items-center justify-between sm:hidden">
		<a
			href="/"
			class="font-display text-avocado-500 text-lg font-bold tracking-tight select-none"
			aria-label="WorldKit Home"
		>
			WorldKit
		</a>

		<div class="flex items-center gap-2">
			<!-- Circle Add Button -->
			<button
				class="bg-avocado-500 hover:bg-avocado-400 flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors"
				onclick={() => onAddCard?.()}
				aria-label="Add new card"
			>
				<Plus class="h-5 w-5" />
			</button>

			<!-- Settings Toggle -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700"
				onclick={() => (settingsOpen = !settingsOpen)}
				aria-label="Open settings"
			>
				{#if settingsOpen}
					<X class="h-5 w-5" />
				{:else}
					<Settings class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Desktop layout (unchanged) -->
	<div class="hidden flex-wrap items-center justify-center gap-3 sm:flex">
		<a
			href="/"
			class="font-display text-avocado-500 hover:text-avocado-400 text-lg font-bold tracking-tight transition-colors select-none"
			aria-label="WorldKit Home"
		>
			WorldKit
		</a>

		<button
			class="bg-avocado-500 hover:bg-avocado-400 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-black transition-colors"
			onclick={() => onAddCard?.()}
			aria-label="Add new card"
		>
			<Plus class="h-4 w-4" />
			<span>Add</span>
		</button>

		<div class="flex items-center gap-1">
			<label for="col-range" class="text-sm text-neutral-400">Col</label>
			<input
				id="col-range"
				type="number"
				min="2"
				max="24"
				bind:value={cols}
				class="border-avocado-500/25 hover:border-avocado-500 w-14 rounded border-[0.5px] bg-transparent px-2 py-1 font-mono text-sm text-neutral-200"
			/>
		</div>

		<div class="flex items-center gap-1">
			<label for="row-range" class="text-sm text-neutral-400">Row</label>
			<input
				id="row-range"
				type="number"
				min="2"
				max="12"
				bind:value={rows}
				class="border-avocado-500/25 hover:border-avocado-500 w-14 rounded border-[0.5px] bg-transparent px-2 py-1 font-mono text-sm text-neutral-200"
			/>
		</div>

		<div class="flex items-center gap-1">
			<label for="corner-radius-select" class="text-sm text-neutral-400">Radius</label>
			<select
				id="corner-radius-select"
				bind:value={cornerRadius}
				class="rounded bg-neutral-800 px-2 py-1 font-mono text-sm text-neutral-200"
			>
				{#each cornerOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-1">
			<label for="gap-select" class="text-sm text-neutral-400">Gap</label>
			<select
				id="gap-select"
				bind:value={gap}
				class="rounded bg-neutral-800 px-2 py-1 font-mono text-sm text-neutral-200"
			>
				{#each Array(9).fill(0).map((_, i) => i) as n}
					<option value={n}>{n}</option>
				{/each}
			</select>
		</div>

		<label
			class="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors"
			style="background-color: {showGridLines ? 'var(--color-avocado-500, #a4e366)' : 'rgb(38 38 38)'}; color: {showGridLines ? 'black' : '#f4f4f5'};"
		>
			<input type="checkbox" bind:checked={showGridLines} class="sr-only" />
			<span>{showGridLines ? 'Grid On' : 'Grid Off'}</span>
		</label>

		<div class="flex items-center gap-1">
			<label for="theme-select" class="text-sm text-neutral-400">Theme</label>
			<select
				id="theme-select"
				bind:value={theme}
				class="rounded bg-neutral-800 px-2 py-1 font-mono text-sm text-neutral-200"
			>
				<option value="system">System</option>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	</div>
</nav>

<!-- Mobile Settings Popup -->
{#if settingsOpen}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm sm:hidden"
		onclick={() => (settingsOpen = false)}
		aria-label="Close settings"
	></button>

	<!-- Settings Panel -->
	<div
		class="fixed bottom-[60px] left-3 right-3 z-[70] rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-md sm:hidden"
	>
		<h3 class="mb-3 text-sm font-semibold text-neutral-300">Settings</h3>

		<div class="grid grid-cols-2 gap-3">
			<!-- Columns -->
			<div class="flex flex-col gap-1">
				<label for="mobile-col" class="text-xs text-neutral-400">Columns</label>
				<input
					id="mobile-col"
					type="number"
					min="2"
					max="24"
					bind:value={cols}
					class="border-avocado-500/25 hover:border-avocado-500 rounded border-[0.5px] bg-transparent px-2 py-1.5 font-mono text-sm text-neutral-200"
				/>
			</div>

			<!-- Rows -->
			<div class="flex flex-col gap-1">
				<label for="mobile-row" class="text-xs text-neutral-400">Rows</label>
				<input
					id="mobile-row"
					type="number"
					min="2"
					max="12"
					bind:value={rows}
					class="border-avocado-500/25 hover:border-avocado-500 rounded border-[0.5px] bg-transparent px-2 py-1.5 font-mono text-sm text-neutral-200"
				/>
			</div>

			<!-- Corner Radius -->
			<div class="flex flex-col gap-1">
				<label for="mobile-radius" class="text-xs text-neutral-400">Radius</label>
				<select
					id="mobile-radius"
					bind:value={cornerRadius}
					class="rounded bg-neutral-800 px-2 py-1.5 font-mono text-sm text-neutral-200"
				>
					{#each cornerOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<!-- Gap -->
			<div class="flex flex-col gap-1">
				<label for="mobile-gap" class="text-xs text-neutral-400">Gap</label>
				<select
					id="mobile-gap"
					bind:value={gap}
					class="rounded bg-neutral-800 px-2 py-1.5 font-mono text-sm text-neutral-200"
				>
					{#each Array(9).fill(0).map((_, i) => i) as n}
						<option value={n}>{n}</option>
					{/each}
				</select>
			</div>

			<!-- Theme -->
			<div class="flex flex-col gap-1">
				<label for="mobile-theme" class="text-xs text-neutral-400">Theme</label>
				<select
					id="mobile-theme"
					bind:value={theme}
					class="rounded bg-neutral-800 px-2 py-1.5 font-mono text-sm text-neutral-200"
				>
					<option value="system">System</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</div>

			<!-- Grid Lines -->
			<div class="flex flex-col gap-1">
				<span class="text-xs text-neutral-400">Grid Lines</span>
				<label
					class="flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
					style="background-color: {showGridLines ? 'var(--color-avocado-500, #a4e366)' : 'rgb(38 38 38)'}; color: {showGridLines ? 'black' : '#f4f4f5'};"
				>
					<input type="checkbox" bind:checked={showGridLines} class="sr-only" />
					<span>{showGridLines ? 'On' : 'Off'}</span>
				</label>
			</div>
		</div>
	</div>
{/if}
