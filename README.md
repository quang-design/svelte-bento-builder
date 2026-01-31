# Svelte Bento Builder

A modern, customizable Bento grid builder app built with SvelteKit 5, Tailwind CSS v4, TypeScript, and Supabase. Design, edit, and manage beautiful bento layouts with a clean, responsive UI and the latest Svelte 5 runes syntax.

## Features

- Interactive bento grid with adjustable columns, rows, and gap
- Live theme switching (light/dark/system)
- Drag & drop grid cards with automatic swapping
- Resize cards from all four corners (NW, NE, SW, SE)
- Add new cards to the grid
- Delete cards on hover
- Rich card content types: headings, paragraphs, circles, typography specimens
- Adjustable corner radius and toggleable grid lines overlay
- Responsive design for mobile/tablet
- Built with Svelte 5 runes syntax & SSR
- Styled with Tailwind CSS v4 using CSS variables
- Type-safe with TypeScript
- Supabase backend ready (optional)

## Tech Stack

- [SvelteKit 5](https://kit.svelte.dev/) (with runes syntax, SSR)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@theme` & CSS variables)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (optional, for backend/db)

## Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/quang-design/svelte-bento-builder.git
   cd svelte-bento-builder
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   npm run preview
   ```

## Usage

- Adjust grid columns, rows, gap, and corner radius from the bottom nav bar
- Toggle grid lines and switch themes (system/light/dark)
- Click **Add** to create new cards
- Hover over a card to reveal the delete button (red X) and resize handles
- Drag cards to reposition; drop onto another card to swap positions
- Resize cards by dragging any corner handle

## Contributing

PRs, issues, and suggestions welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)
