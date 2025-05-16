<script lang="ts">
	import type { GridItem, CornerRadius } from '$lib/types/bento';

	type Props = {
		item: GridItem;
		cornerRadius?: CornerRadius;
	};

	let { item = $bindable(), cornerRadius = 'md' }: Props = $props();
</script>

<!-- <div
	class={`font-display z-1 flex items-center justify-center text-4xl font-medium ${item.color ?? ''} ${item.text ?? ''} transition-all rounded-${cornerRadius}`}
	style={`grid-column: ${item.col} / span ${item.colSpan}; grid-row: ${item.row} / span ${item.rowSpan}; min-height: 80px;`}
>
	{item.content ?? ''}
</div> -->

<div
	data-id={item.id}
	class="hover:border-avocado-500 transition-color z-10 flex h-full min-h-24 w-full items-center justify-center border duration-200 {item.color} rounded-{cornerRadius}"
	style={`grid-column: ${item.col} / span ${item.colSpan}; grid-row: ${item.row} / span ${item.rowSpan}; min-height: 80px;`}
>
	<span class="text-2xl text-white">{item.content}</span>
</div>
