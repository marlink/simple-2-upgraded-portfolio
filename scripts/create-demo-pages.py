#!/usr/bin/env python3
"""
Extract content from showcase.html and create individual demo pages
"""
import re
import os

# Read showcase.html
with open('showcase.html', 'r', encoding='utf-8') as f:
    showcase_content = f.read()

# Read index.html for header/footer structure
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract header (from skip-link to end of header)
header_match = re.search(r'(<a href="#main-content" class="skip-link">.*?</header>)', showcase_content, re.DOTALL)
header = header_match.group(1) if header_match else ''

# Extract footer
footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', showcase_content, re.DOTALL)
footer = footer_match.group(1) if footer_match else ''

# Extract styles from head
styles_match = re.search(r'(<style>.*?</style>)', showcase_content, re.DOTALL)
styles = styles_match.group(1) if styles_match else ''

# Extract head metadata (title, meta tags, links)
head_match = re.search(r'(<head>.*?</head>)', showcase_content, re.DOTALL)
head_content = head_match.group(1) if head_match else ''

# Define tab panels
tabs = [
    ('overview', 'Framework Overview', 'Overview'),
    ('components', 'UI Components', 'Components'),
    ('cards', 'Card Components', 'Cards'),
    ('tokens', 'Design Tokens', 'Design Tokens'),
    ('layout', '12-Column Grid System', 'Layout'),
    ('accessibility', 'Accessibility & Touch Optimization', 'Accessibility'),
    ('typography', 'Fluid Typography System', 'Typography'),
    ('icons', 'Icon Library', 'Icons'),
    ('utilities', 'Utility Classes', 'Utilities'),
    ('photos', 'Photo Gallery & Usage Stats', 'Photos')
]

# Create demo directory if it doesn't exist
os.makedirs('demo', exist_ok=True)

for tab_id, title, short_title in tabs:
    # Find the tab panel content
    pattern = rf'(<div class="tab__panel[^>]*id="tab-{tab_id}"[^>]*>.*?</div>\s*</div>)'
    match = re.search(pattern, showcase_content, re.DOTALL)
    
    if not match:
        # Try alternative pattern
        pattern = rf'(<div[^>]*id="tab-{tab_id}"[^>]*>.*?</div>\s*</div>)'
        match = re.search(pattern, showcase_content, re.DOTALL)
    
    if match:
        panel_content = match.group(1)
        
        # Remove hidden attribute and tab panel wrapper, keep inner content
        panel_content = re.sub(r'<div class="tab__panel[^>]*>', '', panel_content)
        panel_content = re.sub(r'</div>\s*</div>\s*$', '', panel_content)
        panel_content = re.sub(r'hidden\s*', '', panel_content)
        
        # Update asset paths
        panel_content = panel_content.replace('src="assets/', 'src="../assets/')
        panel_content = panel_content.replace('href="assets/', 'href="../assets/')
        panel_content = panel_content.replace('url(\'assets/', 'url(\'../assets/')
        panel_content = panel_content.replace('url("assets/', 'url("../assets/')
        
        # Create page HTML
        page_title = f"{short_title} Demo | Framework Showcase"
        page_description = f"Demo page showcasing {title.lower()} from the responsive CSS framework."
        
        # Update header paths
        updated_header = header.replace('assets/', '../assets/')
        updated_header = updated_header.replace('href="index.html"', 'href="../index.html"')
        updated_header = updated_header.replace('href="about.html"', 'href="../about.html"')
        updated_header = updated_header.replace('href="solutions.html"', 'href="../solutions.html"')
        updated_header = updated_header.replace('href="contact.html"', 'href="../contact.html"')
        updated_header = updated_header.replace('href="blog.html"', 'href="../blog.html"')
        
        # Update footer paths
        updated_footer = footer.replace('assets/', '../assets/')
        updated_footer = updated_footer.replace('href="index.html"', 'href="../index.html"')
        updated_footer = updated_footer.replace('href="about.html"', 'href="../about.html"')
        updated_footer = updated_footer.replace('href="solutions.html"', 'href="../solutions.html"')
        updated_footer = updated_footer.replace('href="contact.html"', 'href="../contact.html"')
        updated_footer = updated_footer.replace('href="blog.html"', 'href="../blog.html"')
        updated_footer = updated_footer.replace('href="showcase.html"', 'href="#"')
        
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{page_title}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="{page_description}">
    <meta name="keywords" content="CSS framework, responsive design, {tab_id}, design system, UI components">
    <meta name="author" content="Marceli Cieplik">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    
    <!-- Unified Responsive Framework -->
    <link rel="stylesheet" href="../assets/css/framework-unified.css">
    <link rel="stylesheet" href="../assets/css/typography-system.css">
    
{styles}
</head>
<body data-theme="dark">
    <!-- Page Load Spinner -->
    <div class="page-spinner">
        <div class="page-spinner__content">
            <div class="page-spinner__logo"></div>
            <div class="page-spinner__spinner"></div>
        </div>
    </div>

{updated_header}

    <main id="main-content">
        <div class="container py-8">
{panel_content}
        </div>
    </main>

{updated_footer}

    <script src="../assets/js/utils.js"></script>
    <script src="../assets/js/main.js"></script>
    <script src="../assets/js/components.js"></script>
</body>
</html>'''
        
        # Write file
        with open(f'demo/{tab_id}.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"Created demo/{tab_id}.html")
    else:
        print(f"Warning: Could not find content for {tab_id}")

print("\nDone! Created all demo pages.")

