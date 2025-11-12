#!/usr/bin/env node

/**
 * Build Showcase Page
 * Assembles showcase.html from component files
 */

const fs = require('fs');
const path = require('path');

const BASE_TEMPLATE = path.join(__dirname, '../components/showcase/base.html');
const OUTPUT_FILE = path.join(__dirname, '../showcase.html');
const COMPONENTS_DIR = path.join(__dirname, '../components/showcase');

// Tab order matches the order in the base template
const TABS = [
    'overview',
    'components',
    'cards',
    'tokens',
    'layout',
    'accessibility',
    'typography',
    'icons',
    'utilities',
    'photos'
];

function buildShowcase() {
    try {
        console.log('🔨 Building showcase.html from components...\n');

        // Read base template
        let content = fs.readFileSync(BASE_TEMPLATE, 'utf8');

        // Replace each tab placeholder with component content
        TABS.forEach((tabName) => {
            const componentPath = path.join(COMPONENTS_DIR, `tab-${tabName}.html`);
            const placeholder = `<!-- TAB:${tabName} -->`;

            if (!fs.existsSync(componentPath)) {
                console.error(`❌ Error: Component file not found: ${componentPath}`);
                process.exit(1);
            }

            const componentContent = fs.readFileSync(componentPath, 'utf8').trim();

            if (content.includes(placeholder)) {
                content = content.replace(placeholder, componentContent);
                console.log(`  ✅ Inserted tab: ${tabName}`);
            } else {
                console.warn(`  ⚠️  Placeholder not found: ${placeholder}`);
            }
        });

        // Write assembled file
        fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

        const stats = fs.statSync(OUTPUT_FILE);
        const fileSizeKB = (stats.size / 1024).toFixed(2);

        console.log(`\n✅ Successfully built showcase.html (${fileSizeKB} KB)`);
        console.log(`   Output: ${OUTPUT_FILE}\n`);

    } catch (error) {
        console.error('❌ Error building showcase:', error.message);
        process.exit(1);
    }
}

// Run build
buildShowcase();

