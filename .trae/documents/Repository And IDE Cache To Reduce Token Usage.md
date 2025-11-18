## Root Cause

* Hardcoded `<body data-theme="dark">` renders dark initially across pages, then JS flips to light → visible flash.

* Spinner overlay uses `var(--color-bg)` so it adopts dark background before JS runs.

* Theme is applied late (end of `<body>`) instead of before CSS loads.

References:

* `index.html:36` and multiple pages set `<body data-theme="dark">` (e.g., `about.html:36`, `solutions.html:36`, `contact.html:35`, `blog.html:48`, `blog-details.html:36`, `blog-details-ceo.html:35`, `typography-demo.html:85`, `404.html:33`).

* Theme logic: `assets/js/main.js:106–174` reads `localStorage.getItem('theme') || 'dark'` and sets `data-theme`.

* Spinner: HTML `index.html:38–43`, CSS `assets/css/framework-unified.css:5698–5712` uses `background-color: var(--color-bg)`.

* CSS variables: light `assets/css/framework-unified.css:66` (`#f0f7f7`), dark `assets/css/framework-unified.css:234` (`#080c0e`).

## Fix Plan

1. Early Theme Set (Inline Head Script)

* Insert a minimal inline script in `<head>` before CSS links in every page to set theme immediately:

```
<script>try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);document.body&&document.body.setAttribute('data-theme',t);}catch(e){}</script>
```

* Purpose: ensures correct theme is applied before CSS paints, eliminating flash.

1. Remove Hardcoded Dark Default

* Change `<body data-theme="dark">` to no `data-theme` (or `light`) in all pages; rely on the early script.

* Files: pages listed above.

1. Neutral Spinner Background

* Update spinner background to avoid dark screen pre-paint. Options:

* Preferred: set `.page-spinner { background-color: transparent; }` in `assets/css/framework-unified.css:5698–5712`.

* Alternative: set a neutral light value that matches light theme regardless of `data-theme`.

1. Minor Enhancements

* Add `<meta name="color-scheme" content="light dark">` in `<head>` to improve initial rendering.

* Ensure no theme transition animations on first paint (optional; keep as-is unless needed).

## Validation

* With light theme stored in `localStorage` (`assets/js/main.js` key `theme`), reload `index.html` and other pages:

* Confirm no dark flash and spinner overlay is transparent.

* Toggle theme and reload to verify both themes start correctly without flashes.

## Implementation Notes

* This is a static HTML setup (no Next/Vite). Apply the inline script and body attribute change consistently across all HTML files.

* No Tailwind darkMode in project; theme is driven by `data-theme` attributes and CSS variables.

## Next Steps

* Apply changes to `index.html` first, verify, then replicate to other pages.

* If desired, keep spinner but transparent; if spinner isn’t needed, consider removing it entirely later.

