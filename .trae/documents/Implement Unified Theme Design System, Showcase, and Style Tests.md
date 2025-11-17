## Scope
- Audit current CSS, JS, and demo pages; implement a unified, theme-aware design system atop existing files.
- Deliver a single showcase page, updated tokens, component rules, theme switch UX, docs, and automated visual/style tests.

## Style Audit (Current State)
- Theme tokens in `assets/css/framework-unified.css:13-218` with dark overrides in `assets/css/framework-unified.css:221-269`; components consume tokens consistently (buttons, nav, hero, cards).
- Theme switching implemented in `assets/js/main.js:110-159` with persistence and smooth hero transitions; toggle icon visibility via CSS in `assets/css/framework-unified.css:1596-1615`.
- Typography scale and utilities in `assets/css/typography-system.css:11-70` and display/heading rules in `assets/css/typography-system.css:72-225`; letter-spacing and line-heights well-defined.
- Spacing/layout system: container and grid in `assets/css/framework-unified.css:381-456` and column rules from `assets/css/framework-unified.css:463-497`; rhythm utilities in `assets/css/framework-unified.css:4516-4635`.
- Interactive states: focus-visible and hover for links/buttons in `assets/css/framework-unified.css:359-375` and `assets/css/framework-unified.css:2899-2952`; nav glassmorphism in `assets/css/framework-unified.css:1303-1372`.
- Existing demo pages show components across themes (`/demo/components.html`, `/demo/dark-theme.html`, `/demo/light-theme.html`).

## Improvements (To Implement)
- Token normalization: remove duplicate brand tokens; add semantic roles (neutral scale, overlay colors), document usage; keep tokens in `framework-unified.css` as single source.
- Contrast tuning: slightly increase dark-outline border opacity and verify `--color-text-muted` against both `--color-bg` values; add automated contrast checks.
- Typography hierarchy: consolidate heading helpers (.h1–.h6) and display classes with clear guidance; expose `--font-base` and line-height tokens centrally.
- Component parity: ensure all components (buttons, badges, alerts, tabs, accordion, modal, tooltip, cards, nav) read tokens only; tighten hover/focus/active across themes.
- Theme transitions: add lightweight CSS transitions on high-level surfaces for smoother theme toggles; keep JS persistence and preload.

## Design System Framework (Files)
- Update `assets/css/framework-unified.css` for tokens, component rules, and theme variables; extend `assets/css/typography-system.css` for type-only utilities.
- Keep demo styles in `assets/css/demo.css` focused on showcase scaffolding.

## Showcase
- Create `demo/showcase.html` combining: tokens, grid/layout, typography, all components, and accessibility examples; one theme toggle proving parity.
- Reuse existing demo content to avoid duplication.

## Automated Testing
- Extend Playwright tests to:
  - Screenshot baseline diffs for key components in both themes.
  - Compute contrast ratios for primary text, muted text, outline borders vs backgrounds using CSS computed styles.
  - Verify hover/focus/active states via simulated interactions.
- Integrate with existing runner `tests/browser-runner.js` and add tests under `tests/specs/style-regression.test.js`.

## Documentation
- Write concise docs:
  - Design tokens and usage: `docs/Design-Tokens.md`.
  - Developer guide (how to use tokens/components): `docs/Design-System-Guide.md`.
  - Showcase usage and extension tips: `docs/Showcase-Guide.md`.
- Keep practical, junior-friendly guidance per user rules.

## Versioning & Performance
- Use existing `version.json` and scripts (`scripts/increment-version.js`) to tag token/component changes (semver: token changes → minor, component changes → patch/minor).
- Continue CSS minification via PostCSS/CSSNano (`postcss.config.js`); optionally add Autoprefixer.

## Milestones
1) Audit & token normalization
2) Component parity & theme transition polish
3) Unified showcase page
4) Style + visual regression tests
5) Documentation & version bump

## Acceptance
- AA contrast passes for body and component text in both themes.
- All showcase examples render identically across themes with consistent interactive states.
- Tests pass locally; minified CSS builds succeed.
- Docs explain tokens/components and how to extend on new pages.