# Scripts Directory

This directory contains utility scripts for maintaining code quality and consistency.

## Available Scripts

### `sync-components.js`

Synchronizes component documentation from `assets/js/components.js` to:
- `.cursorrules` (component patterns section)
- `docs/COMPONENT-LIBRARY.md` (full component reference)

**Usage:**
```bash
npm run sync-components
```

**What it does:**
- Extracts component patterns from `components.js`
- Updates component documentation in `.cursorrules`
- Updates JavaScript Components section in `COMPONENT-LIBRARY.md`
- Updates last synced timestamp

**When to run:**
- After updating `assets/js/components.js`
- When adding new components
- When modifying component HTML structure
- Before committing changes to components

---

### `check-consistency.js`

Checks for common consistency issues across the project:
- Inline styles (except in demo pages)
- Hardcoded colors (outside CSS variable definitions)
- Missing navigation links
- Duplicate IDs (excluding intentionally shared IDs)
- Missing alt text on images
- Missing ARIA labels on interactive elements
- Direct DOM manipulation (should use safeQuery/safeQueryAll)
- Required page structure elements

**Usage:**
```bash
npm run check:consistency
```

**What it does:**
- Scans all HTML files for consistency issues
- Checks CSS files for hardcoded values
- Validates JavaScript files for best practices
- Reports errors and warnings with file locations
- Provides fix suggestions

**Output:**
- ✅ Passed checks (green)
- ⚠️  Warnings (yellow) - review but not blocking
- ❌ Errors (red) - should be fixed before committing

**Exit codes:**
- `0` - All checks passed or only warnings
- `1` - Errors found (should fix before committing)

**When to run:**
- Before committing changes
- In CI/CD pipeline
- After major refactoring
- Regularly to maintain code quality

---

## Running Scripts

All scripts are run via npm:

```bash
# Sync components
npm run sync-components

# Validate HTML
npm run validate:html

# Validate CSS
npm run validate:css

# Validate all
npm run validate:all

# Check consistency
npm run check:consistency
```

---

## Adding New Scripts

1. Create script in `scripts/` directory
2. Add npm script to `package.json`
3. Make script executable: `chmod +x scripts/your-script.js`
4. Document in this README

