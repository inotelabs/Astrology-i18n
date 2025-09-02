# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/[lang]/...`: localized routes (home, posts, tags, search, RSS).
- `src/content/{posts,pages,authors}/<lang>/...`: Markdown/MDX content collections.
- `src/i18n/*.json`: UI dictionaries per locale.
- `src/components`, `src/layouts`, `src/styles`: UI building blocks and theme.
- `src/utils`: i18n, RSS, dates, and helpers.
- `public/`: static assets (e.g., `screenshot.webp`).

## Build, Test, and Development Commands
- `pnpm install`: install dependencies (Node 18+; 20+ recommended).
- `pnpm run dev`: start Astro dev server at `http://localhost:4321`.
- `pnpm run build`: build static site to `dist/` (generates Pagefind index).
- `pnpm run preview`: serve the production build locally.
- Equivalent `npm` commands work (e.g., `npm run dev`).

## Coding Style & Naming Conventions
- Formatting: Prettier enforced via `.prettierrc` (printWidth 100, 2‑space tabs, semicolons, single quotes; Astro and Tailwind plugins enabled for class sorting).
- Languages: Astro/TS/MD/MDX. Keep components small and colocate styles.
- Naming: use kebab‑case for content filenames, e.g., `src/content/posts/en/20250101-new-year.md`.
- Imports: prefer absolute from `src/` where configured; otherwise relative.

## Testing Guidelines
- No formal test suite yet; validate via `pnpm run build` and `pnpm run preview`.
- Check per‑locale pages load, RSS endpoints work, and search returns results.
- For content changes, lint/format before PR: `npx prettier -w .` (or editor integration).

## Commit & Pull Request Guidelines
- History has no strict convention; use Conventional Commits when possible:
  - `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`
- PRs should include: concise description, linked issues, before/after screenshots for UI, and notes on i18n impact (which locales touched).
- Keep PRs focused and small; update `src/i18n/<lang>.json` when adding UI strings.

## Security & Configuration Tips
- Set `site` in `astro.config.mjs` for correct absolute URLs (OG, sitemap, RSS).
- Add languages in `src/utils/i18n.ts`, `src/content.config.ts`, and `src/i18n/<lang>.json`.
- Prefer local images or provide explicit width/height for remote images.
