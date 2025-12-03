# Repository Guidelines

This project is a React + TypeScript tactical animation tool that relies on a JSON-based configuration layer. Use this guide to understand how the pieces fit together and how to contribute effectively.

## Project Structure & Architecture
- `src/` holds all runtime code. Key areas: `components/` (UI layouts, toolbars, pitch layers), `hooks/` (domain logic such as animation, selection, exports), `lib/` (math/render helpers), `types/` and `@types/` for shared contracts.
- `public/` contains static assets and the live `.aigenrc` configuration consumed at startup. Keep root and public copies in sync.
- `tests/` stores higher-level flows (keyboard shortcuts, export pipelines). Co-locate component-level tests beside their source when it improves clarity.
- `docs/` gathers PRD, configuration deep dives, and explainer guides. Update them whenever behavior changes.
- Product intent: empower coaches to sketch tactical setups quickly, animate plays with keyframes/traces, and export/share artifacts (PNG/GIF/MP4/SVG/JSON). All changes should protect that workflow.

### Runtime Flow
1. `src/index.tsx` mounts `App`.
2. `App` loads `.aigenrc` via `useAppConfig`, then renders `FootballAnimator` inside shared providers.
3. `FootballAnimator` composes hook clusters such as `useFootballAnimatorLogic`, which coordinates tools, keyframes, traces, exports, and UI state.

## Build, Test & Development Commands
- `npm start` – Launch dev server with hot reload.
- `npm run build` – Create production bundle in `build/` (never commit).
- `npm test` / `npm run test:watch` / `npm run test:coverage` – Run Jest suites.
- `npm run mcp:start` / `npm run mcp:dev` – Start the Model Context Protocol server used by in-app agent tooling.
- `npm run deploy` – Publish to GitHub Pages (runs build first). Use only from clean `main`.
- `npm run sync-config` – Copy `.aigenrc` to `public/.aigenrc` for browser loading.
- `node regex-analyze.js <pattern> [--context N]` – Regex-based repo scan (wraps ripgrep output).

## Coding Style & Naming Conventions
- TypeScript, strict typing, functional React components, and hooks-first state management.
- Use two-space indentation, camelCase for variables/functions, PascalCase for React components/types, and kebab-case for non-component files (e.g., `use-app-config.ts`).
- Tailwind CSS drives styling. Keep utility classes inline unless they repeat—extract to `src/components/ui/` or dedicated components.
- Favor composition over inheritance. Prefer existing helpers (`clsx`, `tailwind-merge`, providers) before introducing new utilities.

## Testing Guidelines
- Jest + React Testing Library with jsdom. Test file naming: `*.test.tsx` or `*.test.ts`.
- Validate observable behavior (rendered SVG, keyboard shortcuts, animation state) rather than implementation details.
- Add integration tests under `tests/` for workflows (exporting GIF, switching pitch types). Keep coverage steady, especially for `football-animator` logic, hooks, and exporters.
- Run `npm test` before pushing; include results in PR description.

## Configuration & Environment Notes
- `.aigenrc` drives toolbars, line styles, pitch types, UI theming, and feature flags. If the file is removed, rebuild it from `docs/CONFIG_SNAPSHOT.md` and copy to `public/.aigenrc`.
- Document new config fields in `docs/CONFIGURATION.md`. Include default values and migration steps when changing key names or shapes. Update `docs/CONFIG_SNAPSHOT.md` with the new reference.
- Consider scripting `npm run sync-config` to keep root/public copies aligned.
- Use `.env` for secrets only if absolutely required. Never commit API keys.

## Commit & Pull Request Process
- Write imperative, present-tense commit messages (`Fix element placement in defensive pitch`). Reference Jira/Trello/issue IDs when possible.
- Each PR must include: summary, motivation, screenshots or GIFs for UI changes, test evidence (commands + results), and notes about config or data migrations.
- CI (if enabled) should pass before requesting review. Keep PRs scoped (<500 LOC when possible) and prefer feature branches named `feature/<topic>` or `fix/<bug>`.

## Quality & Observability Checklist
- Manual QA: verify adding players/opponents, drawing lines, toggling traces, exporting JSON/PNG, and switching pitch types.
- Animation QA: ensure keyframes interpolate smoothly, trace overlays match player/ball movement, playback controls stay responsive, and exports (PNG/GIF/MP4) match the plan.
- Performance: avoid unnecessary re-renders; memoize heavy SVG layers, debounce pointer events, and keep `getSVGCoordinates` fast.
- Accessibility: ensure buttons have labels (tooltips in `.aigenrc` help), maintain focus traps in dialogs, and test keyboard navigation.
- Error handling: surfaces from `useAppConfig` should log descriptive messages and fall back to defaults without crashing.

## From-Scratch Improvement Opportunities
- Introduce e2e smoke tests (Playwright or Cypress) covering key scenarios.
- Add telemetry hooks to observe configuration loading failures and export errors.
- Consider a modular `.aigenrc` schema (split toolbar, pitches, styles) to reduce merge conflicts.
- Automate config sync (e.g., `npm run sync-config`) to copy `.aigenrc` to `public/`.
- Document animation architecture more deeply (sequence diagrams) in `docs/` to help new contributors troubleshoot “app not working” reports.
- Add config validation (JSON Schema) and warning instrumentation now that `.aigenrc` may be missing in some environments.
- Build preset coach workflows (set-piece library, defensive shape templates) once core experience is stable.
