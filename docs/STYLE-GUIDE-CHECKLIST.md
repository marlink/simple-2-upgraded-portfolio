# Style Guide Checklist

Use this checklist to ensure your code follows project standards before committing.

## HTML

- [ ] **Semantic HTML5 elements used**
  - [ ] Using `<header>`, `<nav>`, `<main>`, `<footer>`
  - [ ] Using `<article>`, `<section>` where appropriate
  - [ ] Proper heading hierarchy (h1 → h2 → h3)

- [ ] **Navigation matches standard structure**
  - [ ] All 5 links present: Home, About, Solutions, Contact, Blog
  - [ ] Desktop navigation structure matches `.cursorrules`
  - [ ] Mobile menu structure matches desktop
  - [ ] Theme toggle present with proper ARIA labels
  - [ ] Active page link has `.is-active` class

- [ ] **Footer matches standard structure**
  - [ ] Footer navigation consistent across pages
  - [ ] Footer links match navigation links

- [ ] **No inline styles**
  - [ ] No `style=""` attributes (use utility classes)
  - [ ] Check: `grep -r 'style="' *.html` (should only find demo pages)

- [ ] **All images have alt text**
  - [ ] Every `<img>` has `alt` attribute
  - [ ] Decorative images use `alt=""`
  - [ ] Informative images have descriptive alt text

- [ ] **Skip link present**
  - [ ] `<a href="#main-content" class="skip-link">` present
  - [ ] Links to `<main id="main-content">`

- [ ] **Theme toggle present with ARIA labels**
  - [ ] Theme toggle button has `aria-label="Toggle color theme"`
  - [ ] Theme toggle has `type="button"`
  - [ ] Icons have proper alt text

## CSS

- [ ] **Uses design tokens (--space-*, --color-*)**
  - [ ] Spacing uses `var(--space-*)` variables
  - [ ] Colors use `var(--color-*)` variables
  - [ ] Typography uses `var(--font-size-*)` variables
  - [ ] No hardcoded pixel values (except in CSS variable definitions)

- [ ] **Follows BEM naming**
  - [ ] Block: `.block`
  - [ ] Element: `.block__element`
  - [ ] Modifier: `.block--modifier` or `.block__element--modifier`

- [ ] **Uses utility classes for spacing**
  - [ ] Margin: `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*`
  - [ ] Padding: `.pt-*`, `.pb-*`, `.pl-*`, `.pr-*`, `.py-*`, `.px-*`
  - [ ] No inline spacing styles

- [ ] **Works in both light/dark themes**
  - [ ] Colors tested in both themes (use theme toggle)
  - [ ] Text readable in both themes
  - [ ] Contrast ratios meet WCAG AA minimum
  - [ ] Using theme-aware CSS variables

- [ ] **Responsive breakpoints correct**
  - [ ] Mobile-first approach
  - [ ] Using responsive grid classes (`.col-md-*`, `.col-lg-*`, etc.)
  - [ ] Content readable at all breakpoints (300px - 2400px+)

## JavaScript

- [ ] **No duplicate functions**
  - [ ] Functions defined once
  - [ ] No duplicate utility functions across files

- [ ] **Uses safeQuery/safeQueryAll**
  - [ ] No direct `document.querySelector` or `querySelectorAll`
  - [ ] Using `safeQuery()` and `safeQueryAll()` from `utils.js`
  - [ ] Proper null checking

- [ ] **Theme toggle works**
  - [ ] Toggles between light and dark themes
  - [ ] Theme persists (localStorage)
  - [ ] Works on both desktop and mobile

- [ ] **Navigation mobile menu works**
  - [ ] Burger menu toggles mobile menu
  - [ ] Overlay closes menu on click
  - [ ] Menu closes on link click
  - [ ] ARIA expanded state updates correctly

## Components

- [ ] **Tabs component**
  - [ ] Required ARIA attributes present
  - [ ] `.is-active` class on active tab/panel
  - [ ] `aria-controls` matches panel `id`

- [ ] **Accordion component**
  - [ ] `aria-expanded` on buttons
  - [ ] `hidden` attribute on closed panels

- [ ] **Modal component**
  - [ ] `data-modal-target` on trigger
  - [ ] `data-modal-close` on close buttons
  - [ ] Modal has `id` and `hidden` attribute

- [ ] **Forms**
  - [ ] All inputs have associated labels
  - [ ] Required fields marked
  - [ ] Form validation works

## Accessibility

- [ ] **ARIA labels**
  - [ ] All interactive elements have `aria-label` or `aria-labelledby`
  - [ ] Icon-only buttons have descriptive labels
  - [ ] Navigation landmarks properly labeled

- [ ] **Keyboard navigation**
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus indicators visible
  - [ ] Tab order logical

- [ ] **Screen reader support**
  - [ ] Semantic HTML used
  - [ ] ARIA attributes where needed
  - [ ] Alt text descriptive

## Performance

- [ ] **No unnecessary inline styles**
  - [ ] Styles in CSS files, not inline
  - [ ] Utility classes used where possible

- [ ] **Images optimized**
  - [ ] Appropriate image formats (WebP, SVG where possible)
  - [ ] Alt text present

## Testing

- [ ] **Browser testing**
  - [ ] Tested in Chrome/Edge
  - [ ] Tested in Firefox
  - [ ] Tested in Safari (if available)

- [ ] **Theme testing**
  - [ ] Tested in light theme
  - [ ] Tested in dark theme
  - [ ] Theme toggle works

- [ ] **Responsive testing**
  - [ ] Mobile view (300px+)
  - [ ] Tablet view (768px+)
  - [ ] Desktop view (1024px+)
  - [ ] Large desktop (1600px+)

- [ ] **Functionality testing**
  - [ ] All links work
  - [ ] Forms submit correctly
  - [ ] Interactive components work
  - [ ] No console errors

## Quick Commands

```bash
# Validate HTML and CSS
npm run validate:all

# Check consistency
npm run check:consistency

# Find inline styles
grep -r 'style="' *.html

# Find hardcoded colors
grep -r '#[0-9a-fA-F]\{6\}' assets/css/

# Sync components (if components.js was modified)
npm run sync-components
```

---

**Remember:** This checklist helps maintain code quality. Not every item applies to every change, but review what's relevant to your work.

