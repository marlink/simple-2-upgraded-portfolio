## Goal
Make cache warming automatic at the start of any dev workflow to reduce repeated work and token usage.

## Add Script
- Create `scripts/dev/bootstrap-cache.js`
- Warm caches using existing `scripts/cache/index.js`:
  - Cache file lists for `assets/js`, `assets/css`, `demo`, root HTML files
  - Cache per-file metadata (size, mtime, hash) for JS/CSS/HTML
  - Optionally parse CSS variables from `assets/css/framework-unified.css` and store under `tokens:css-vars`
- Write into `.trae-cache/dev-bootstrap.json` via `PersistentLRU` (keys: `files:*`, `meta:*`, `tokens:*`).

## Auto-Run Rules
Update `package.json` scripts so the bootstrap runs before common dev commands:
- Add `"bootstrap": "node scripts/dev/bootstrap-cache.js"`
- Add lifecycle hooks:
  - `preserver:start`: `npm run bootstrap && node scripts/start-server.js`
  - `prebuild`: `npm run bootstrap`
  - `pretest`: `npm run bootstrap`
  - `prepare`: `npm run bootstrap` (runs on install)
- Keep existing commands intact; only prepend the bootstrap.

## Git Ignore
- Add `.trae-cache/` to `.gitignore` to avoid committing cache files.

## Validation
- Run `npm run server:start` and confirm `.trae-cache/` is created and populated.
- Run `npm test` and `npm run build` to verify no behavior changes and cache warms beforehand.

## Notes
- No external dependencies added; uses existing Node tooling.
- Safe, opt-in cache usage; falls back gracefully if cache dir isn’t writable.
- Minimal code, no comments per project style; uses synchronous fs for reliability during pre-scripts.