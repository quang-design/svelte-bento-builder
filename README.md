# Svelte Bento Builder

A modern, customizable Bento grid builder app built with SvelteKit 5, Tailwind CSS v4, TypeScript, and Supabase. Design, edit, and manage beautiful bento layouts with a clean, responsive UI and the latest Svelte 5 runes syntax.

![Screenshot](./screenshot.png)

## Features

- ⚡ Interactive bento grid with adjustable columns, rows, and gap
- 🎨 Live theme switching (light/dark/system)
- 🧩 Drag & resize grid cards (planned)
- 🗑️ Add & delete cards (planned)
- 📏 Adjustable corner radius and grid lines
- 💡 Responsive design for mobile/tablet
- 🧑‍💻 Built with Svelte 5 runes syntax & SSR
- 🎨 Styled with Tailwind CSS v4 using CSS variables
- 🔒 Type-safe with TypeScript
- ☁️ Supabase backend ready (optional)

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
   # or pnpm install / yarn
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # Visit http://localhost:5173 (or shown URL)
   ```

4. **Build for production:**

   ```bash
   npm run build
   npm run preview
   ```

## Usage

- Adjust grid columns, rows, gap, and corner radius from the bottom nav
- Toggle grid lines and theme
- Add, delete, drag, and resize cards (see roadmap for status)

## Contributing

PRs, issues, and suggestions welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)

---

> Made with ❤️ using Svelte 5, Tailwind v4, and TypeScript.
