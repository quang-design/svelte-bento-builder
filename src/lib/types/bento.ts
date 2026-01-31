// src/lib/types/bento.ts
export type CornerRadius =
	| 'none'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| 'full';
export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CardContentType = 'text' | 'heading' | 'paragraph' | 'circle' | 'typography';

export type GridItem = {
	id: number;
	content?: string;
	contentType?: CardContentType;
	color?: string;
	text?: string;
	col?: number;
	row?: number;
	colSpan?: number;
	rowSpan?: number;
};
