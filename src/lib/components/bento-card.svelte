<script lang="ts">
	// Svelte 5 runes mode
	let {
		content,
		color = '',
		text = '',
		col = 1,
		row = 1,
		colSpan = 1,
		rowSpan = 1,
		cornerRadius = 12
	} = $props();
</script>

<div
	class={`font-display flex items-center justify-center text-4xl font-medium ${color} ${text} transition-all`}
	style={`grid-column: ${col} / span ${colSpan}; grid-row: ${row} / span ${rowSpan}; border-radius: ${cornerRadius}px; min-height: 80px;`}
>
	{content}
</div>
