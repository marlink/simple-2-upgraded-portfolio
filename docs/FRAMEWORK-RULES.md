# Framework Rules & Style Guide

**Last Updated:** Auto-synced with project standards  
**Version:** 1.0.0

This document serves as the comprehensive guide for developing pages and components within the Simple-2 project. It includes all framework rules, coding standards, accessibility requirements, and theme guidelines.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [HTML Standards](#html-standards)
3. [CSS Framework Rules](#css-framework-rules)
4. [JavaScript Standards](#javascript-standards)
5. [Component Library](#component-library)
6. [Theme System](#theme-system)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [File Structure](#file-structure)
9. [Git Workflow](#git-workflow)
10. [Development Checklist](#development-checklist)

---

## Project Overview

**Simple-2** is a static HTML/CSS/JS website with a custom responsive CSS framework. The project focuses on:

- Mobile-first responsive design
- Accessibility-first development
- Vanilla JavaScript (no frameworks)
- Design system approach with reusable components
- Light/dark theme support
- Performance optimization

### Key Technologies

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, CSS Grid, Flexbox, modern features
- **Vanilla JavaScript**: No dependencies, modern ES6+ features
- **CSS Custom Properties**: Design tokens system

---

## HTML Standards

### Required Page Structure

All HTML pages must follow this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Title – Your School</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="...">
    <meta name="keywords" content="...">
    <meta name="author" content="Marceli Cieplik">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marceicieplik.com/page.html">
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="...">
    <meta property="og:image" content="https://marceicieplik.com/assets/logo/mc-logo.svg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="https://marceicieplik.com/page.html">
    <meta name="twitter:title" content="Page Title">
    <meta name="twitter:description" content="...">
    <meta name="twitter:image" content="https://marceicieplik.com/assets/logo/mc-logo.svg">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=Inter:wght@400;600&display=swap" rel="stylesheet">

    <!-- Theme initialization script (runs before CSS to prevent FOUC) -->
    <script>
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
                if (document.body) {
                    document.body.setAttribute('data-theme', theme);
                }
            } catch (e) {
                // Silently fail if localStorage is not available
            }
        })();
    </script>

    <!-- Unified Responsive Framework -->
    <link rel="stylesheet" href="assets/css/framework-unified.css">
    <!-- Demo styles (only for demo pages) -->
    <link rel="stylesheet" href="assets/css/demo.css">
</head>
<body data-theme="dark">
    <!-- Page Load Spinner -->
    <div class="page-spinner">
        <div class="page-spinner__content">
            <div class="page-spinner__logo"></div>
            <div class="page-spinner__spinner"></div>
        </div>
    </div>

    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="site-header">
        <!-- Navigation (see Navigation section) -->
    </header>

    <main id="main-content">
        <!-- Page content -->
    </main>

    <footer class="site-footer">
        <!-- Footer content -->
    </footer>

    <!-- Scripts -->
    <script src="assets/js/utils.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/components.js"></script>
</body>
</html>
```

### Navigation Structure (REQUIRED - Must match across all pages)

```html
<header class="site-header">
    <nav class="nav">
        <a class="nav__logo" href="index.html" aria-label="Home">
            <img src="assets/logo/mc-logo.svg" alt="Marceli Cieplik" class="nav__logo-img">
        </a>
        <button type="button" class="nav__burger" aria-label="Toggle menu" aria-expanded="false">
            <span class="nav__burger-line"></span>
            <span class="nav__burger-line"></span>
            <span class="nav__burger-line"></span>
        </button>
        <div class="nav__menu">
            <ul class="nav__links">
                <li><a href="index.html" class="nav__link nav__link--underline">Home</a></li>
                <li><a href="about.html" class="nav__link nav__link--underline">About</a></li>
                <li><a href="solutions.html" class="nav__link nav__link--underline">Solutions</a></li>
                <li><a href="contact.html" class="nav__link nav__link--underline">Contact</a></li>
                <li><a href="blog.html" class="nav__link nav__link--underline">Blog</a></li>
                <li><a href="components.html" class="nav__link nav__link--underline">Components</a></li>
            </ul>
            <button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle theme">
                <span class="theme-toggle__icon theme-toggle__icon--light">
                    <img src="assets/icons/sun.svg" alt="Light theme" width="24" height="24">
                </span>
                <span class="theme-toggle__icon theme-toggle__icon--dark">
                    <img src="assets/icons/moon.svg" alt="Dark theme" width="24" height="24">
                </span>
            </button>
        </div>
        <div class="nav__overlay"></div>
        <div class="nav__mobile-menu">
            <!-- Mobile menu (same links as desktop) -->
        </div>
    </nav>
</header>
```

### Semantic HTML Requirements

- ✅ Use `<header>`, `<nav>`, `<main>`, `<footer>` semantic elements
- ✅ Use `<article>`, `<section>` where appropriate
- ✅ Maintain proper heading hierarchy (h1 → h2 → h3)
- ✅ Use `<button>` for interactive elements, not `<div>` or `<span>`
- ✅ Include proper `alt` text for all images

### Accessibility Requirements

- ✅ Include `skip-link` for keyboard navigation
- ✅ All interactive elements must have proper ARIA labels
- ✅ Images require descriptive `alt` attributes
- ✅ Forms must have proper labels and fieldsets
- ✅ Color contrast must meet WCAG AA standards (4.5:1 for text, 3:1 for UI)

---

## CSS Framework Rules

### Design Tokens System

All styling uses CSS custom properties (design tokens):

```css
/* Colors */
--color-primary: #your-primary-color;
--color-secondary: #your-secondary-color;
--color-bg: #background-color;
--color-text: #text-color;
--color-border: #border-color;

/* Spacing (8px baseline) */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
/* ... up to --space-16: 128px */

/* Typography */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
/* ... up to --font-size-4xl: 2.25rem */

/* Other tokens */
--border-radius: 8px;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Spacing System

**ALWAYS use spacing utilities - NEVER use inline styles:**

```html
<!-- ✅ Correct -->
<div class="mt-4 mb-6 px-3">Content</div>

<!-- ❌ Wrong -->
<div style="margin-top: 32px; margin-bottom: 48px; padding: 0 24px;">Content</div>
```

Available spacing utilities:
- Margin: `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*`, `.my-*` (vertical), `.mx-*` (horizontal)
- Padding: `.pt-*`, `.pb-*`, `.pl-*`, `.pr-*`, `.py-*` (vertical), `.px-*` (horizontal)
- Values: 1-16 (8px to 128px in 8px increments)

### Grid System

Use the 12-column responsive grid system:

```html
<div class="container">
    <div class="grid">
        <div class="col-12 col-md-6 col-lg-4">Content</div>
        <div class="col-12 col-md-6 col-lg-8">Content</div>
    </div>
</div>
```

- `.container`: Centers content and adds responsive padding
- `.grid`: Creates the grid container
- `.col-*`: Column classes (1-12)
- Responsive breakpoints: `col-xs-*`, `col-sm-*`, `col-md-*`, `col-lg-*`, `col-xl-*`, `col-xxl-*`, `col-xxxl-*`

### BEM Naming Convention

**ALWAYS follow BEM methodology:**

```css
/* Block */
.component-name {}

/* Element */
.component-name__element {}

/* Modifier */
.component-name--modifier {}
.component-name__element--modifier {}
```

Examples:
- `.btn` (block)
- `.btn__text` (element)
- `.btn--primary` (modifier)
- `.btn__text--loading` (element modifier)

### Forbidden Patterns

**NEVER DO THIS:**
- ❌ Inline `style=""` attributes
- ❌ Hardcoded pixel values (use `--space-*` variables)
- ❌ Custom colors not defined as CSS variables
- ❌ Duplicate IDs across pages
- ❌ Non-semantic class names

---

## JavaScript Standards

### Core Principles

- **Vanilla JavaScript only** - No frameworks or libraries
- **Use utility functions** - Always use `safeQuery()` and `safeQueryAll()` from `utils.js`
- **Progressive enhancement** - Ensure functionality works without JavaScript
- **Performance first** - Minimal DOM queries, efficient algorithms

### Required Patterns

```javascript
// ✅ Correct: Use safeQuery utilities
import { safeQuery as $, safeQueryAll as $$ } from './utils.js';

const button = $('#my-button');
const buttons = $$('.my-button');

// ❌ Wrong: Direct DOM queries
const button = document.querySelector('#my-button');
const buttons = document.querySelectorAll('.my-button');
```

### Component Initialization

All JavaScript components must be initialized properly:

```javascript
// components.js pattern
(function initializeComponents() {
    // Wait for DOM ready
    setTimeout(() => {
        try {
            // Initialize components
            initTabs();
            initAccordions();
            // ...
        } catch (error) {
            console.error('Component initialization failed:', error);
        }
    });
})();
```

### Event Handling

- Use event delegation where possible
- Always clean up event listeners
- Handle touch events for mobile devices

---

## Component Library

### JavaScript Components

#### Tabs Component

```html
<div class="tabs" data-tabs>
    <div class="tablist" role="tablist" aria-label="Tab navigation">
        <button class="tab is-active" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-btn-1">Tab 1</button>
        <button class="tab" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-btn-2">Tab 2</button>
    </div>
    <div id="panel-1" class="tab__panel is-active" role="tabpanel" aria-labelledby="tab-btn-1">Content 1</div>
    <div id="panel-2" class="tab__panel" role="tabpanel" aria-labelledby="tab-btn-2">Content 2</div>
</div>
```

**Required attributes:**
- `role="tab"` on buttons
- `role="tabpanel"` on panels
- `aria-controls` on buttons matching panel IDs
- `aria-labelledby` on panels matching button IDs
- `aria-selected="true/false"` on buttons
- `.is-active` class on active elements

#### Accordion Component

```html
<div class="accordion" data-accordion>
    <div class="accordion__item">
        <button class="accordion__button" aria-expanded="false">Question</button>
        <div class="accordion__panel" hidden>Answer</div>
    </div>
</div>
```

**Required attributes:**
- `aria-expanded="true/false"` on buttons
- `hidden` attribute on collapsed panels

#### Modal Component

```html
<button data-modal-target="#my-modal">Open Modal</button>

<div class="modal" id="my-modal" hidden>
    <div class="modal__overlay" data-modal-close></div>
    <div class="modal__dialog">
        <button data-modal-close aria-label="Close">×</button>
        <div class="modal__body">Content</div>
    </div>
</div>
```

**Data attributes:**
- `data-modal-target="#modal-id"` on trigger buttons
- `data-modal-close` on close buttons

#### Tooltip Component

```html
<button data-tooltip="Tooltip text here">Hover me</button>
```

#### Code Copy Button

```html
<pre class="code-block">
    <code>const example = 'code';</code>
</pre>

<div class="code-example">npm install package</div>
```

#### Video Cover Component

```html
<div class="video-cover" data-video-cover>
    <video class="video-cover__video" loop muted playsinline>
        <source src="video.mp4" type="video/mp4">
    </video>
    <img src="cover.jpg" alt="Cover" class="video-cover__cover">
    <div class="video-cover__play-icon" aria-hidden="true">▶</div>
</div>
```

### CSS Components

#### Buttons

```html
<!-- Variants -->
<button class="btn btn--primary">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--text">Text</button>

<!-- Sizes -->
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary">Normal</button>
<button class="btn btn--primary btn--big">Big</button>
<button class="btn btn--primary btn--lg">Large</button>
```

#### Cards

```html
<article class="card card--glass-outline">
    <div class="card__body">
        <h3>Title</h3>
        <p>Content</p>
    </div>
</article>
```

**Variants:**
- `.card--glass-outline` (default)
- `.card--solid`
- `.card--shadow-sm/md/lg`

#### Forms

```html
<form class="form">
    <div class="form__row">
        <label for="name" class="form__label">Name</label>
        <input type="text" id="name" class="form__input" required>
    </div>
    <div class="form__row">
        <button type="submit" class="btn btn--primary">Submit</button>
    </div>
</form>
```

#### Alerts

```html
<div class="alert alert--success">
    <strong>Success!</strong> Message text.
    <button class="alert__close" aria-label="Close alert">&times;</button>
</div>
```

**Variants:** `alert--success/error/warning/info`

#### Badges

```html
<span class="badge">Default</span>
<span class="badge badge--pill">Pill</span>
<span class="badge badge--outline">Outline</span>
<span class="badge badge--success">Success</span>
```

---

## Theme System

### Critical: Theme Testing Requirements

**MANDATORY: Test every color change in both light and dark themes**

When modifying colors or themes:
1. ✅ Verify color visibility in light theme
2. ✅ Verify color visibility in dark theme
3. ✅ Confirm WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)
4. ✅ Maintain visual hierarchy in both themes
5. ✅ Test interactive states (hover, focus) in both themes

### Theme Implementation

```html
<!-- Theme is set on html and body elements -->
<html data-theme="dark">
<body data-theme="dark">
```

```javascript
// Theme toggle functionality (handled by main.js)
document.addEventListener('themeToggle', (e) => {
    const theme = e.detail.theme; // 'light' or 'dark'
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});
```

### Theme-Aware Color Variables

Always use theme-aware CSS variables:

```css
:root {
    /* Light theme colors */
    --color-bg: #ffffff;
    --color-text: #0f172a;
    --color-surface: #f8fafc;
    --color-border: #e2e8f0;
}

[data-theme="dark"] {
    /* Dark theme colors */
    --color-bg: #0f172a;
    --color-text: #f1f5f9;
    --color-surface: #1e293b;
    --color-border: #334155;
}
```

### Color Token Categories

- **Primary colors**: `--color-primary`, `--color-primary-contrast`
- **Semantic colors**: `--color-success`, `--color-danger`, `--color-warning`, `--color-info`
- **Neutral colors**: `--color-text`, `--color-text-muted`, `--color-bg`, `--color-surface`, `--color-border`

### Theme Testing Checklist

Before committing theme changes:
- [ ] All text is readable in both themes
- [ ] All interactive elements have sufficient contrast
- [ ] Color-coded elements maintain meaning in both themes
- [ ] Shadows and borders are visible in both themes
- [ ] Images/icons work in both themes
- [ ] No FOUC (Flash of Unstyled Content) occurs

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Mandatory requirements:**
- **Color contrast**: 4.5:1 minimum for normal text, 3:1 for large text/UI elements
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen readers**: Proper ARIA labels and semantic markup
- **Focus indicators**: Visible focus outlines on all interactive elements
- **Alt text**: Descriptive alternative text for all images

### ARIA Implementation

```html
<!-- Good ARIA examples -->
<button aria-label="Close menu" aria-expanded="false">×</button>
<nav aria-label="Main navigation">
<input aria-describedby="email-help" id="email">
<div id="email-help">We'll never share your email.</div>
```

### Keyboard Navigation

- **Tab order**: Logical tab sequence through interactive elements
- **Focus management**: Proper focus trapping in modals
- **Keyboard shortcuts**: Standard shortcuts (Escape to close modals, etc.)
- **Skip links**: "Skip to main content" link for screen readers

### Touch Targets

- **Minimum size**: 44px × 44px touch targets on mobile
- **Spacing**: Adequate spacing between interactive elements
- **Touch feedback**: Visual feedback for touch interactions

---

## File Structure

```
/
├── index.html                 # Home page
├── about.html                 # About page
├── solutions.html             # Solutions page
├── contact.html               # Contact page
├── blog.html                  # Blog listing
├── components.html            # Component showcase
├── assets/
│   ├── css/
│   │   ├── framework-unified.css    # Main framework
│   │   ├── framework-unified.min.css
│   │   ├── demo.css                 # Demo page styles
│   │   └── typography-system.css    # Typography
│   ├── js/
│   │   ├── utils.js                 # Utility functions
│   │   ├── main.js                  # Main site functionality
│   │   └── components.js            # UI components
│   ├── images/                      # Images
│   ├── icons/                       # Icons
│   └── logo/                        # Logo assets
├── docs/                            # Documentation
└── demo/                            # Demo pages
```

---

## Git Workflow

### Branch Strategy

- **Single branch workflow**: Use `main` branch only
- **No feature branches**: All development happens on `main`

### Before Making Changes

1. Check current branch: `git branch`
2. Verify remote: `git remote -v`
3. Ensure clean working directory: `git status`

### Development Workflow

```bash
# 1. Check current status
git status
git branch

# 2. Make changes to files

# 3. Use git manager for commit (commits locally, pushes to GitHub every 5 commits)
node scripts/git-manager.js commit "Improve components page layout and add missing components"

# Check batch status anytime
node scripts/git-manager.js status

# Force immediate push if needed
node scripts/git-manager.js push
```

### Commit Message Guidelines

- **Descriptive**: Clearly explain what changed and why
- **Present tense**: "Add feature" not "Added feature"
- **Specific**: Mention affected components/pages

Examples:
- ✅ "Improve spacing and layout for components showcase page"
- ✅ "Add video cover component to components page"
- ✅ "Fix theme toggle accessibility in mobile menu"

### Batch Push System

This project uses a batch push system to reduce GitHub API calls while maintaining local commit frequency:

- **Local commits**: Changes are committed locally after every completed task
- **Batched pushes**: Pushes to GitHub only every 5 commits
- **Status tracking**: Use `node scripts/git-manager.js status` to see current batch progress
- **Force push**: Use `node scripts/git-manager.js push` for immediate push when needed
- **Counter reset**: Counter resets to 0 after each batch push

Benefits:
- **Local**: Granular version control with frequent local commits
- **Remote**: Reduced GitHub API usage with batched pushes
- **Reliable**: Local changes are always saved, remote backup every 5 tasks

### Forbidden Actions

- ❌ Never commit to wrong repository
- ❌ Never push without testing changes
- ❌ Never commit broken code
- ❌ Never modify git history without coordination
- ❌ Never bypass the git manager script for commits

---

## Development Checklist

Use this checklist before committing changes:

### HTML
- [ ] Semantic HTML5 elements used (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Proper heading hierarchy maintained (h1 → h2 → h3)
- [ ] All images have descriptive `alt` attributes
- [ ] Skip link present for accessibility (`<a href="#main-content" class="skip-link">`)
- [ ] No inline `style=""` attributes used
- [ ] Navigation structure matches standard across all pages
- [ ] Theme toggle present with proper ARIA labels

### CSS
- [ ] Design tokens used (`--color-*`, `--space-*`, `--font-size-*`)
- [ ] BEM naming convention followed (`.block__element--modifier`)
- [ ] Spacing utilities used (`.mt-*`, `.mb-*`, `.px-*`, etc.)
- [ ] No hardcoded pixel values (except in CSS variable definitions)
- [ ] Colors tested in both light and dark themes
- [ ] Responsive breakpoints used correctly (`.col-md-*`, `.col-lg-*`)
- [ ] No duplicate CSS rules

### JavaScript
- [ ] `safeQuery()` and `safeQueryAll()` used instead of direct DOM queries
- [ ] No duplicate utility functions
- [ ] Progressive enhancement implemented
- [ ] Error handling included
- [ ] Event listeners cleaned up properly
- [ ] Performance optimized (minimal DOM queries)

### Components
- [ ] Required ARIA attributes present on interactive components
- [ ] `.is-active` class used for active states in tabs
- [ ] `aria-expanded` used in accordions
- [ ] `data-modal-target` and `data-modal-close` used in modals
- [ ] Proper semantic markup for all components

### Theme & Accessibility
- [ ] All colors work in both light and dark themes
- [ ] Contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader support included
- [ ] Touch targets meet minimum size requirements (44px)

### Testing
- [ ] Page loads without console errors
- [ ] All interactive elements function correctly
- [ ] Mobile responsive design verified
- [ ] Cross-browser compatibility checked
- [ ] Performance impact assessed

### Git
- [ ] Changes committed to correct branch (`main`)
- [ ] Descriptive commit message used
- [ ] No sensitive data included in commits
- [ ] Repository and remote verified before push

---

## Quick Reference

### Spacing Scale
- `--space-1`: 8px
- `--space-2`: 16px
- `--space-3`: 24px
- `--space-4`: 32px
- `--space-6`: 48px
- `--space-8`: 64px
- `--space-12`: 96px
- `--space-16`: 128px

### Breakpoints
- `xs`: < 600px
- `sm`: 600px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `xxl`: 1600px
- `xxxl`: 2400px

### Color Categories
- **Primary**: `--color-primary`
- **Semantic**: `--color-success`, `--color-danger`, `--color-warning`, `--color-info`
- **Neutral**: `--color-text`, `--color-bg`, `--color-surface`, `--color-border`

### Typography Scale
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)

Remember: **Fix root causes, not symptoms**. Always test changes in both light and dark themes. Follow the established patterns for consistency and maintainability.
