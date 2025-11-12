# Code Consistency Setup Guide

This document explains the code consistency tools and processes set up for the Simple-2 project.

## What Was Created

### 1. Expanded `.cursorrules` File ✅

**Location:** `.cursorrules`

**What it contains:**
- Complete HTML structure standards
- Navigation structure (required across all pages)
- CSS class naming conventions
- JavaScript component patterns (synced from `components.js`)
- Forbidden patterns (what NOT to do)
- Design tokens reference
- Responsive breakpoints

**How it helps:**
- Cursor AI uses this file to understand project patterns
- Ensures consistent code generation
- Prevents common mistakes

### 2. HTML Template Snippets ✅

**Location:** `.cursor/snippets/html-templates.code-snippets`

**Available snippets:**
- `page-template` - Complete page structure
- `grid` - Grid system container
- `btn-primary` - Primary button
- `btn-outline` - Outline button
- `card` - Card component
- `tabs` - Tabs component
- `accordion` - Accordion component
- `modal` - Modal component
- `form` - Form structure
- `alert` - Alert component

**How to use:**
1. Type the snippet prefix (e.g., `page-template`)
2. Press Tab to expand
3. Fill in the placeholders

### 3. Validation Tools ✅

**Files created:**
- `package.json` - npm scripts and dependencies
- `.htmlvalidate.json` - HTML validation rules
- `.stylelintrc.json` - CSS linting rules

**Available commands:**
```bash
# Install dependencies first
npm install

# Validate HTML
npm run validate:html

# Validate CSS
npm run validate:css

# Validate everything
npm run validate:all
```

**What they check:**
- HTML: Inline styles, missing attributes, invalid structure
- CSS: BEM naming, custom property patterns, vendor prefixes

### 4. Component Library Document ✅

**Location:** `docs/COMPONENT-LIBRARY.md`

**What it contains:**
- Complete reference for all JavaScript components
- CSS component examples
- Grid system documentation
- Spacing utilities
- Design tokens reference
- Best practices

**Auto-synced from:** `assets/js/components.js`

### 5. Component Sync Script ✅

**Location:** `scripts/sync-components.js`

**Purpose:** Keeps component documentation in sync with actual code

**Usage:**
```bash
npm run sync-components
```

**What it does:**
- Extracts component patterns from `components.js`
- Updates `.cursorrules` component section
- Updates `docs/COMPONENT-LIBRARY.md` JavaScript Components section
- Updates last synced timestamp

**When to run:**
- After updating `assets/js/components.js`
- When adding new components
- When modifying component HTML structure
- Before committing component changes

---

## How to Use Everything

### Daily Workflow

1. **Before coding:**
   - Check `.cursorrules` for patterns
   - Use snippets for common structures

2. **While coding:**
   - Cursor AI will use `.cursorrules` for suggestions
   - Use snippets for quick component insertion

3. **After coding:**
   - Run `npm run validate:all` to check for issues
   - Run `npm run sync-components` if you updated components.js

### Adding New Components

1. Add component to `assets/js/components.js`
2. Update component patterns in `scripts/sync-components.js`
3. Run `npm run sync-components`
4. Verify `.cursorrules` and `COMPONENT-LIBRARY.md` are updated

### Maintaining Consistency

1. **Regular validation:**
   ```bash
   npm run validate:all
   ```

2. **Check for inline styles:**
   ```bash
   grep -r 'style="' *.html
   ```

3. **Check for hardcoded colors:**
   ```bash
   grep -r '#[0-9a-fA-F]\{6\}' assets/css/
   ```

4. **Sync components after updates:**
   ```bash
   npm run sync-components
   ```

---

## File Structure

```
simple-2/
├── .cursor/
│   └── snippets/
│       └── html-templates.code-snippets  # HTML snippets
├── .cursorrules                          # Cursor AI rules (expanded)
├── .htmlvalidate.json                    # HTML validation config
├── .stylelintrc.json                     # CSS linting config
├── package.json                          # npm scripts & dependencies
├── scripts/
│   ├── sync-components.js               # Component sync script
│   └── README.md                         # Scripts documentation
└── docs/
    ├── COMPONENT-LIBRARY.md             # Component reference (auto-synced)
    └── CONSISTENCY-SETUP.md             # This file
```

---

## Quick Reference

### Validation Commands

```bash
npm run validate:html      # Validate all HTML files
npm run validate:css       # Validate all CSS files
npm run validate:all       # Validate everything
```

### Sync Commands

```bash
npm run sync-components    # Sync component docs from components.js
```

### Snippet Prefixes

- `page-template` - Full page structure
- `grid` - Grid system
- `btn-primary` - Primary button
- `btn-outline` - Outline button
- `card` - Card component
- `tabs` - Tabs component
- `accordion` - Accordion component
- `modal` - Modal component
- `form` - Form structure
- `alert` - Alert component

---

## Troubleshooting

### Validation Errors

**HTML validation fails:**
- Check `.htmlvalidate.json` rules
- Fix inline styles (use utility classes)
- Add missing required attributes

**CSS validation fails:**
- Check `.stylelintrc.json` rules
- Fix BEM naming violations
- Use CSS custom properties instead of hardcoded values

### Sync Script Issues

**Script doesn't update files:**
- Check that `components.js` exists
- Verify file paths in script
- Check Node.js version (requires Node 12+)

**Component patterns not extracted:**
- Update component patterns in `scripts/sync-components.js`
- Ensure component structure matches script expectations

---

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run initial sync:**
   ```bash
   npm run sync-components
   ```

3. **Validate existing code:**
   ```bash
   npm run validate:all
   ```

4. **Start using snippets:**
   - Type snippet prefixes in Cursor
   - Press Tab to expand

5. **Set up pre-commit hook (optional):**
   - Add validation to git hooks
   - Prevent committing invalid code

---

## Questions?

- Check `docs/COMPONENT-LIBRARY.md` for component details
- Check `.cursorrules` for coding standards
- Check `scripts/README.md` for script documentation

