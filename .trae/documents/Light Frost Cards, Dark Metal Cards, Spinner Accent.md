## Goals
- Light theme: convert homepage hero cards to frosted white glass (clean, airy)
- Dark theme: restyle hero cards to sophisticated black with rich metal-like shadow
- Spinner: brighten loader ring using the accent color
- Keep dark theme as-is elsewhere; ensure theme switch inversion stays coherent

## Token Usage
- Continue using light accents: `--color-accent: #83c5be`, `--color-accent-hover: #006d77`
- Optional second accent available: `--color-accent-2`, `--color-accent-2-hover`
- Leverage existing glass variables; add light frost overrides already present

## Homepage Card Styling
- Target selector: `.hero-card` defined under hero section
- Light theme overrides (`body[data-theme="light"] .hero-card`):
  - `background: rgba(255,255,255,0.7)` with `backdrop-filter: blur(24px) saturate(150%)`
  - `border: 1px solid var(--glass-border-light)` and `box-shadow: var(--shadow-sm)`
  - Text color `var(--text-primary)`; subtle icon/text tone if needed
  - Hover: elevate to `var(--shadow-md)` and minor translateY
- Dark theme overrides (`body[data-theme="dark"] .hero-card`):
  - `background: linear-gradient(180deg, #262c34 0%, #14181f 100%)`
  - `border: 1px solid rgba(255,255,255,0.06)`; shadow stack: `var(--shadow-lg)` plus faint inner highlight
  - Hover: richer shadow and very small scale/translate for premium feel
- Maintain 300x300 size, gap and mobile stack as implemented

## Reuse Frost From Nav (Optional)
- Apply the same light glass recipe used for `.site-header--scrolled` to `.hero-card` for a consistent frost feel: `background: var(--glass-bg-light)`, `backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))`, `border: var(--border-width) solid var(--glass-border-light)`
- Adjust opacity to avoid noisy texture on solid cards

## Spinner Loader Accent
- Selector: `.page-spinner__spinner` in `assets/css/framework-unified.css`
- Update ring color to accent: `border-top-color: var(--color-accent-hover)`
- Optionally increase thickness to 4px and lighten base ring `border-color: rgba(0,0,0,0.2)` in dark, `rgba(0,0,0,0.08)` in light
- Keep animation and accessibility unchanged

## Implementation Steps
1. Add theme-specific overrides for `.hero-card` (light frost + dark metal) scoped under `body[data-theme]`
2. Update spinner ring color to use `--color-accent-hover`, adjust thickness as requested
3. Verify contrast and hover/focus states; ensure no layout shifts
4. Build CSS and preview on `index.html` (light/dark) and `solutions.html` to validate brand coherence
5. Run browser tests and basic responsive checks (375, 768, 1280 widths)

## Testing & Validation
- Visual: manual inspection in Chrome, Firefox, Safari
- Automated: run existing Playwright tests; add screenshot checks for homepage hero cards (optional)
- Accessibility: ensure focus-visible rings remain; touch target unchanged

## Rollback Plan
- Changes are isolated to `.hero-card` and spinner; easy to revert by removing theme overrides if the look needs adjustment

Confirm to proceed and I’ll implement the CSS overrides, rebuild, and show previews for light/dark homepage cards and spinner behavior.