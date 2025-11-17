## Goals
- Reduce small variations in borders and colors in the light theme by consolidating to a clear token set.
- Add a simple "Components" page that lists and demos our UI pieces, and link it from the footer.
- Add guardrails so new styles use tokens (no random hex values or ad‑hoc radii/borders) unless explicitly allowed.

## Scope & Files
- Design tokens and theme: `assets/css/framework-unified.css` (light `:root` and dark overrides)
- Typography tokens: `assets/css/typography-system.css`
- Demo styles (for the catalog): `assets/css/demo.css`
- Footer and pages: `index.html`, `about.html`, `solutions.html`, `contact.html`, `blog.html`, etc.
- JS interactions/components: `assets/js/main.js`, `assets/js/components.js`
- Lint configs: `.stylelintrc.json`, `.eslintrc.json`, `postcss.config.js`

## Light Theme Cleanup
1. Consolidate border tokens in `framework-unified.css`:
   - Keep a minimal set for widths: `--border-width-sm`, `--border-width`, `--border-width-lg`.
   - Keep a minimal set for radii: `--radius-sm`, `--radius-md`, `--radius-lg`.
   - Keep a minimal set for colors: `--border-default`, `--border-muted`, `--border-strong`.
2. Replace hardcoded values:
   - Search for `border:` / `border-*:` and hex colors; refactor to use the tokens above.
   - Normalize button, card, input, tabs/accordion borders to `--border-default` unless a clear reason for `--border-strong`.
3. Color consistency:
   - Use `--color-text` and `--color-text-muted` for text; avoid custom hex.
   - Use `--color-bg` / `--color-surface` for backgrounds, `--color-primary` only for accents and interactive states.
4. Shadows/focus:
   - Prefer `--shadow-sm|md|lg` and `--focus-ring-color`; remove bespoke box‑shadows.

## Components Catalog Page
1. Create `components.html` that showcases:
   - Buttons (primary/outline/sizes), Cards (variants), Tabs, Accordion, Modal, Tooltip, Grid, Forms (inputs/selects), Alerts/Badges if present.
   - Reuse existing markup patterns from `demo/*.html` and classes from `assets/js/components.js`.
2. Styling:
   - Use existing `assets/css/demo.css` and tokens; no new theme values.
3. Navigation:
   - Add a footer link `Components` under `.site-footer .footer__nav` on primary pages.

## Guardrails (No Random Styles)
1. Stylelint plugin: add `stylelint-declaration-strict-value` to enforce variables for properties:
   - `color`, `background-color`, `border-color`, `box-shadow`, `border-radius`, `border-width` must use `var(--...)` tokens.
2. Stylelint rules:
   - Disallow hex colors for `color`/`background-color` via `declaration-property-value-disallowed-list` except inside tokens.
   - Keep `custom-property-pattern` to ensure token naming consistency.
3. Pre-commit/CI:
   - Add `lint-staged` to run `stylelint` on `assets/css/**/*.css` and block commits on violations.
   - Add `npm run lint:css` to CI; fail on rule violations.
4. Escape hatch:
   - Allow explicit expansion with inline `/* stylelint-disable-next-line declaration-strict-value */` and a brief comment.

## Verification
- Run the site and visually check:
  - Light theme looks consistent across buttons, cards, forms, tabs, accordion, modal.
  - Dark theme unaffected (tokens override only when needed).
- Lint:
  - Run CSS lint; fix any violations until clean.

## Deliverables
- Updated token set in `assets/css/framework-unified.css` with reduced variants.
- `components.html` showcasing all UI components; linked from the footer on main pages.
- Updated `.stylelintrc.json` and dev tooling to enforce token usage.

## Acceptance Criteria
- No hardcoded hex colors or pixel radii/widths remain in component styles; everything uses tokens.
- Only 3 radii, 3 border widths, and 3 border color strengths used in light theme.
- Components page loads, demonstrates all components, and uses only existing tokens.
- Lint passes locally and in CI; commits blocked if ad‑hoc styles are introduced.